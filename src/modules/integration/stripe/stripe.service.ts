import { STRIPE_SECRET } from '@const/environments'
import { CreatePaymentInput } from '@core/inputs'
import { getOrderDetailsByStripeId } from '@db/order/order.db'
import { getRealEstateByReId, unholdTokens } from '@db/real-estate/real-estate.db'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { BaseHttpService } from '@shared/base.http.service'
import Stripe from 'stripe'
import { v4 as uuidv4 } from 'uuid'
import { PaymentType } from '../../../utils'
import { CheckoutService } from '../../checkout/checkout.service'
// import { CoinifyService } from '../coinify/coinify.service'

@Injectable()
export class StripeService extends BaseHttpService {
  private readonly stripe: Stripe
  private readonly stripeLogger: Logger = null

  constructor(
    protected httpService: HttpService,
    protected checkoutService: CheckoutService, // private coinifyService: CoinifyService
  ) {
    super(httpService)
    this.stripe = new Stripe(STRIPE_SECRET, {
      apiVersion: '2020-08-27',
      typescript: true,
    })
    this.stripeLogger = new Logger(StripeService.name, { timestamp: true })
  }

  async createStripePaymentIntent(data: CreatePaymentInput) {
    // await this.coinifyService.doValidation(data)
    this.stripeLogger.log('Creating stripe paymentIntent')

    const order_id = uuidv4()
    const someDate: any = new Date()
    someDate.setMinutes(someDate.getMinutes() + 30)
    const checkoutSession = await this.stripe.checkout.sessions.create({
      cancel_url: data?.returnUrl,
      success_url: data?.successUrl,
      submit_type: 'pay',
      mode: 'payment',
      line_items: [
        {
          quantity: data.tokensInThisOrder,
          amount: data.tokenPrice * 100,
          currency: 'USD',
          name: '3Blocks Checkout Process',
        },
      ],
      metadata: {
        user_id: data.user_id,
        re_id: data.re_id,
        order_id,
      },
      expires_at: Math.round(someDate.getTime() / 1000),
    })

    await this.checkoutService.createOrder(
      data,
      order_id,
      data.tokenPrice,
      {
        amount_subtotal: checkoutSession.amount_subtotal,
        amount_total: checkoutSession.amount_total,
        cancel_url: checkoutSession.cancel_url,
        currency: checkoutSession.currency,
        expires_at: checkoutSession.expires_at,
        success_url: checkoutSession.success_url,
        url: checkoutSession.url,
        id: checkoutSession.id,
      },
      PaymentType.Stripe,
    )
    return new Promise<any>(resolve => {
      resolve({
        url: checkoutSession.url,
        user_id: data.user_id,
        re_id: data.re_id,
        order_id,
      })
    })
  }

  public calculateAmount(quantity: number, price: number): number {
    return price * quantity
  }

  async cancleStripePaymentIntent(idcreation: string): Promise<string> {
    try {
      const id = idcreation.split('#')[0]
      const session = await this.stripe.checkout.sessions.expire(id)
      Logger.log(`SESSION expired : ${JSON.stringify(session)}`)
      const resp = await getOrderDetailsByStripeId({
        metadata: {
          id,
        },
      })
      /* 
      To track the order we are not deleting from db.
      await deleteOrder({
              re_id: resp.re_id,
              orderId: resp.orderId,
            })
       */
      const tokensInThisOrder = resp.tokensInThisOrder
      const existingPropInfo = await getRealEstateByReId({ re_id: resp.re_id })
      // Calculate TokensOnHold, regarless of success or failure
      await unholdTokens({
        re_id: resp.re_id,
        tokensOnHold: Math.abs(existingPropInfo.tokensOnHold - tokensInThisOrder),
        tokensRemaining: existingPropInfo.tokensRemaining + tokensInThisOrder,
      })

      return 'done'
    } catch (e) {
      Logger.error(JSON.stringify(e))
      throw e
    }
  }
}

/*

this.stripe.webhookEndpoints.create({
url: '',
enabled_events: [],
api_version: '2020-08-27'
})

Creating a PaymentIntent
To get started, see the accept a payment guide.
It describes how to create a PaymentIntent on the server and pass its client secret to the client instead of passing the entire PaymentIntent object.
The client confirms the payment, and your server monitors webhooks to detect when the payment successfully completes or fails.
When you create the PaymentIntent, you can specify options like the amount and currency:

Step 1
https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements

Webhook information
https://stripe.com/docs/payments/payment-methods#compatibility

Webhook Configuration:
https://dashboard.stripe.com/test/webhooks/create?endpoint_location=hosted
*/
