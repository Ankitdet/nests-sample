import { PaymentType, TransactionStatus } from '@core/enums'
import { RealEstateSchema } from '@core/schemas'
import { OrderSchema } from '@core/schemas/integrations/order/order.schema'
import { RealEstateUserSchema } from '@core/schemas/real-estate/real-estate-user.schema'
import { getExistiongOrder, OrderDB, saveOrder, updateOrder } from '@db/order/order.db'
import {
  createRealEstateHavingUser,
  getRealEstateHavingUser,
  RealEstateUserDB,
  updateRealEstateHavingUser,
} from '@db/real-estate/real-estate-user.db'
import {
  getRealEstateByReId,
  holdTokens,
  unholdTokens,
} from '@db/real-estate/real-estate.db'
import { getCognitoUserDetail } from '@db/user/users.db'
import { Injectable } from '@nestjs/common'
import { logger } from '@shared/logger/logger'
import { SQSRecord } from 'aws-lambda'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { AWSSesService } from '../aws-ses/aws-ses.service'
import { BlockchainService } from '../integration/blockchain/blockchain.service'
// import { UserService } from '../user/user.service'
// import { PandaDocResolver } from '../integration/panda-doc/panda-doc.resolver'
import { PaymentStatus, successOrder } from './checkout.enum'

@Injectable()
export class CheckoutService {
  constructor(
    private readonly sesService: AWSSesService,
    // private readonly userService: UserService,
    // private readonly pandaResolver: PandaDocResolver,
    private readonly alchemyService: BlockchainService,
  ) {
    // empty
  }
  public async createOrder(
    data: Omit<OrderSchema, 'order_id'>,
    order_id?: string,
    tokenPrice?: number,
    metadata?: any,
    paymentType?: PaymentType,
  ): Promise<OrderSchema> {
    const order: OrderSchema = {
      re_id: data.re_id,
      user_id: data.user_id,
      orderId: order_id,
      orderTotalUsd: this.calculateAmount(tokenPrice, data.tokensInThisOrder),
      paymentType,
      paymentStatus: TransactionStatus.InProgess,
      tokensInThisOrder: data.tokensInThisOrder,
      orderCurrency: 'USD',
      metadata,
    }

    const newOrder = new OrderDB(order)
    // Step 1, Save the order first.
    await saveOrder({
      ...order,
    })
    logger.info(`Step 1: Order is created with fields:,${JSON.stringify(newOrder)}`)

    // Step 2, set tokenOnHold and tokenRemaining for PropInfo
    await this.checkoutProcess(data.re_id, data.tokensInThisOrder)

    // return Oder details back
    return new Promise<OrderSchema>(resolve => {
      resolve(order)
    })
  }

  public calculateAmount(quantity: number, price: number): number {
    return price * quantity
  }

  public async updateCoinifyOrder(order: SQSRecord): Promise<any> {
    const { order_id, re_id, user_id, status } = JSON.parse(order.body)
    logger.info(`UpdateCoinify Order,state: ${status},order_id: ${order_id}`)
    // Step 1: Get the existingOrder
    const existingOrder: [OrderSchema] = await getExistiongOrder({
      orderId: order_id,
    })

    if (!existingOrder || _.isEmpty(existingOrder)) {
      logger.info(`Order not found having orderid:${order_id}`)
      return
    }
    const paymentStatus = existingOrder[0].paymentStatus
    if (paymentStatus === PaymentStatus.Complete) {
      return
    }
    const isOrderSuccess = _.includes(successOrder, status)
    logger.info(`orderStatus ${isOrderSuccess}`)

    // Step 2: Update the Order with new status
    await updateOrder({
      re_id,
      user_id,
      orderId: order_id,
      paymentStatus: status,
    })

    const tokensInThisOrder = existingOrder[0].tokensInThisOrder
    // Step 3: Get the existing propInfo
    const existingPropInfo = await getRealEstateByReId({ re_id })

    // Calculate TokensOnHold, regarless of success or failure
    const tokensOnHoldField = Math.abs(
      existingPropInfo.tokensOnHold - tokensInThisOrder,
    )

    // Calculate TokensSold
    const tokenSoldField = isOrderSuccess
      ? existingPropInfo.tokensSold + tokensInThisOrder
      : existingPropInfo.tokensSold

    // Calculate TokensRemaining
    const tokensRemainingField = isOrderSuccess
      ? existingPropInfo.tokensRemaining
      : existingPropInfo.tokensRemaining + tokensInThisOrder

    await unholdTokens({
      re_id,
      tokensOnHold: tokensOnHoldField,
      tokensRemaining: tokensRemainingField,
      tokensSold: tokenSoldField,
    })

    // If Order is completed or Done
    if (status === PaymentStatus.Complete) {
      const existing: RealEstateUserSchema = await getRealEstateHavingUser({
        re_id,
        user_id,
      })

      const totalTokenOwned = _.isNumber(existing?.totalTokensOwnedByBuyer)
        ? existing?.totalTokensOwnedByBuyer + tokensInThisOrder
        : tokensInThisOrder

      const tokenTransferredWallet = _.isNumber(existing?.tokenTransferredWallet)
        ? existing?.tokenTransferredWallet + tokensInThisOrder
        : tokensInThisOrder

      const realEstateUser = new RealEstateUserDB({
        re_id,
        user_id,
        add: existingPropInfo.add,
        city: existingPropInfo.city,
        state: existingPropInfo.state,
        zip: existingPropInfo.zip,
        totalTokensOwnedByBuyer: totalTokenOwned,
        tokenTransferredWallet,
      })
      await createRealEstateHavingUser(realEstateUser)

      /*  await this.pandaResolver.createAndSendingDocument({
         address: existingPropInfo.add,
         orderDate: String(new Date()),
         dollarValue: existingOrder[0].orderTotalUsd,
         tokens: tokensInThisOrder,
         order_id,
         user_id,
         re_id,
       }) */
      try {
        await this.alchemyService.tokenTransfer(
          Number(tokensInThisOrder),
          order_id,
          re_id,
          user_id,
        )
      } catch (e) {
        logger.error(
          `Error while transferring token in Polygon Blockchain: ${JSON.stringify(e)}`,
        )
        await updateRealEstateHavingUser({
          re_id,
          user_id,
          failedTokensTransferred: existing?.failedTokensTransferred
            ? existing?.failedTokensTransferred + totalTokenOwned
            : totalTokenOwned,
        })
        await this.sesService.failedTokenTransfered(
          order_id,
          re_id,
          tokensInThisOrder,
          user_id,
          JSON.stringify(e),
        )
        return
      }
      // Apply Bonus stuff.
      // await this.userService.applyBonusToUser(user_id, existingOrder[0].orderTotalUsd)

      const userEmailAddress = (await getCognitoUserDetail({ user_id }))?.email
      logger.info(`Sending the email to ${userEmailAddress}`)
      await this.sesService.successEmail(order_id, userEmailAddress)
    } else {
      /*  await this.sesService.failedEmail(order_id) */
    }
  }

  public async checkoutProcess(
    re_id?: string,
    tokensInThisOrder?: number,
  ): Promise<void> {
    const params: RealEstateSchema = {
      re_id,
    }
    const existingProp: RealEstateSchema = await getRealEstateByReId({
      re_id,
    })

    if (existingProp?.tokensOnHold) {
      params.tokensOnHold = existingProp.tokensOnHold + tokensInThisOrder
    } else {
      params.tokensOnHold = tokensInThisOrder
    }

    if (existingProp?.tokensRemaining) {
      params.tokensRemaining = existingProp.tokensRemaining - tokensInThisOrder
    } else {
      params.tokensRemaining = existingProp?.totalNumberOfTokens - tokensInThisOrder
    }

    if (!existingProp?.tokensSold) {
      params.tokensSold = 0
    }
    await holdTokens(params)
    logger.info(
      `Step 2: PropInfo, TokenOnHold and TokenRemaining Set:,
      ${JSON.stringify(params)}`,
    )
  }
  public async buyTokens(re_id: string, user_id: string): Promise<any> {
    const orderId = uuid()
    await saveOrder({
      orderId,
      re_id,
      user_id,
    })
    logger.info(`OrderID created ${orderId}`)
    return {
      re_id,
      user_id,
      order_id: orderId,
    }
  }

  public async updateOperatingOrSubscriptionAgreement(
    order_id: string,
    subscriptionDocTimestamp: string,
    operatingDocTimestamp: string,
  ): Promise<any> {
    await updateOrder({
      orderId: order_id,
      subscriptionDocTimestamp,
      operatingDocTimestamp,
    })
    logger.info(
      `OrderId : ${order_id},subscriptionDocTimestamp:${subscriptionDocTimestamp},operatingDocTimestamp : ${operatingDocTimestamp}`,
    )
    return {
      order_id,
      subscriptionDocTimestamp,
      operatingDocTimestamp,
    }
  }
}
