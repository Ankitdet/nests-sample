import {
  COINIFY_API_KEY,
  COINIFY_API_SECRET,
  COINIFY_API_URL,
  COINIFY_WEBHOOK,
} from '@const/environments'
import { CreatePaymentInput } from '@core/inputs'
import {
  CoinifyPaymentResponse,
  CreatePaymentInterface,
  PaymentBody,
} from '@core/interfaces'
import { RealEstateSchema, UserDBSchema } from '@core/schemas'
import { getUserInfoById as getUserInfoById } from '@db/integration/blockchain/blockchain.db'
import { getRealEstateByReId } from '@db/real-estate/real-estate.db'
import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable } from '@nestjs/common'
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'
import { BaseHttpService } from '@shared/base.http.service'
import { BaseError, errorMessages } from '@shared/errors'
import { logger } from '@shared/logger/logger'
import { PaymentType } from '@utils/index'
import forge from 'node-forge'
import { v4 as uuid } from 'uuid'
import { CheckoutService } from '../../checkout/checkout.service'
@Injectable()
export class CoinifyService extends BaseHttpService {
  constructor(
    public httpService: HttpService,
    private readonly checkoutService: CheckoutService,
  ) {
    super(httpService)
  }

  public async createCoinifyPayment(input: CreatePaymentInterface): Promise<any> {
    await this.doValidation(input)
    const nonce = Date.now()
    const headers = {
      Authorization: `Coinify apikey=${COINIFY_API_KEY}, nonce=${nonce}, signature=${this.signature(
        nonce,
      )}`,
    }
    const url = COINIFY_API_URL + '/payments'

    const order_id = uuid()

    const body: PaymentBody = {
      amount: this.checkoutService.calculateAmount(
        input.tokenPrice,
        input.tokensInThisOrder,
      ),
      currency: 'USD',
      plugin_name: '3Blocks API',
      plugin_version: '1.0.0',
      customer_id: order_id,
      custom: {
        re_id: input.re_id,
        user_id: input.user_id,
        order_id,
      },
      return_url: input.returnUrl,
      callback_url: COINIFY_WEBHOOK.replace('<hostname>', input['hostname']),
    }
    // create the conify payments first
    const resp: AxiosResponse<CoinifyPaymentResponse> = await super
      .httpPost(url, body, {
        headers,
      })
      .then(e => {
        if (e.error) {
          throw e.error.message
        }
        return e
      })
      .catch(e => {
        logger.error('Error while Coinify Payment API', e)
        throw e
      })
    logger.info(`Coinify Payment Response: ${JSON.stringify(resp)}`)
    const metadata: any = resp?.data
    const meta = {
      bitcoin: metadata?.bitcoin,
      callback_url: metadata?.callback_url,

      expire_time: metadata?.expire_time,
      payment_url: metadata?.payment_url,
    }
    // create order in DB
    await this.checkoutService.createOrder(
      input,
      order_id,
      input.tokenPrice,
      meta,
      PaymentType.Coinify,
    )

    return resp
  }

  public async doValidation(input: CreatePaymentInput) {
    // Checkout user has etherium address found.
    const userData: UserDBSchema = await getUserInfoById(input.user_id)
    const existingProp: RealEstateSchema = await getRealEstateByReId({
      re_id: input.re_id,
    })

    if (!userData) {
      throw new BaseError(
        HttpStatus.NOT_FOUND,
        `${errorMessages.error.USER['USER-001']} ${input.user_id}`,
      )
    }
    if (!userData.whitelistAddress || !userData.kycStatus) {
      throw new BaseError(
        HttpStatus.NOT_FOUND,
        `${errorMessages.error.USER['USER-002']} ${input.user_id}.`,
      )
    }
    const tokensExisting = existingProp.tokensRemaining
      ? existingProp.tokensRemaining
      : existingProp.totalNumberOfTokens

    if (tokensExisting < input.tokensInThisOrder) {
      throw new BaseError(
        HttpStatus.NOT_ACCEPTABLE,
        `Your number of tokens is larger then total available tokes. you requested for ${input.tokensInThisOrder} and available is ${tokensExisting}`,
      )
    }

    if (!existingProp.totalNumberOfTokens || !existingProp.tokenPrice) {
      throw new BaseError(
        HttpStatus.NOT_FOUND,
        `${errorMessages.error.RE['RE-003']} ${input.re_id}`,
      )
    }

    if (!existingProp || !existingProp.tokenId) {
      if (!existingProp.tokenId) {
        throw new BaseError(
          HttpStatus.NOT_FOUND,
          `${errorMessages.error.RE['RE-001']} ${input.re_id}`,
        )
      } else {
        throw new BaseError(
          HttpStatus.NOT_FOUND,
          `${errorMessages.error.RE['RE-002']} ${input.re_id}`,
        )
      }
    }
  }

  private signature(nonce: number) {
    const hmac = forge.hmac.create()
    hmac.start('sha256', COINIFY_API_SECRET)
    hmac.update(nonce + COINIFY_API_KEY)
    return hmac.digest().toHex().toLowerCase()
  }
}
