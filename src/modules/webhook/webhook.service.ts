import { SQSType } from '@const/common.const'
import {
  AWS_SQS_QUEUE_URL,
  ONFIDO_API_TOKEN,
  ONFIDO_WORKFLOW_RUN,
  PANDA_DOC_SQS_QUEUE,
  STRIPE_SECRET,
  STRIPE_WEBHOOK_SECRET,
} from '@const/environments'
import { updateOnfidoKYCStatusInDB } from '@db/user/users.db'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { BaseHttpService } from '@shared/base.http.service'
import { logger } from '@shared/logger/logger'
import { Request } from 'express'
import Stripe from 'stripe'
import { AWSSesService } from '../aws-ses/aws-ses.service'
import { AWSSqsService } from '../aws-sqs/aws-sqs.service'
import { PaymentStatus } from '../checkout/checkout.enum'
import { PandaDocService } from '../integration/panda-doc/panda-doc.service'
import { UserService } from '../user/user.service'

@Injectable()
export class WebhookService extends BaseHttpService {
  private readonly stripe: Stripe
  constructor(
    protected httpService: HttpService,
    private readonly pandadocService: PandaDocService,
    private readonly sqsService: AWSSqsService,
    private readonly userService: UserService,
    private readonly sesService: AWSSesService,
  ) {
    super(httpService)
    logger.info('Webhook called.')
    this.stripe = new Stripe(STRIPE_SECRET, {
      apiVersion: '2020-08-27',
      typescript: true,
    })
  }

  async updateOnfidoKYCStatus(onfido: any): Promise<void> {
    /* 
    webhook response
    {
       "payload": {
         "resource_type": "workflow_run",
           "action": "workflow_run.completed",
             "object": {
           " id": "<WORKFLOW_RUN_ID>",
             "completed_at_iso8601": "2022-02-10T15:48:37.389407",
               "href": "https://api.onfido.com/v4/workflow_runs/<WORKFLOW_RUN_ID>"
         }
       }
     } */
    Logger.log(`Onfido Response ${JSON.stringify(onfido)}`)
    if (onfido.action === 'workflow_run.completed') {
      const workflow_run_id = onfido?.object?.id
      const data = await super.httpGet(`${ONFIDO_WORKFLOW_RUN}/${workflow_run_id}`, {
        headers: {
          Authorization: `Token token=${ONFIDO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      })
      Logger.log(`Onfido API Response ${JSON.stringify(data)}`)
      const { user_id, kyc_status, email } = await updateOnfidoKYCStatusInDB(
        workflow_run_id,
        data.status,
      )
      Logger.log(
        `Onfido WorkFlow state ${data.status},userId ${user_id},kyc Status: ${kyc_status}, User Email ${email}`,
      )
      await this.userService.switchRole(user_id)
      await this.sesService.onfidoKycEmail(email, kyc_status)
    }
    /*
    in_progress
    clear
    fail
    manual_review
    cancelled 
    */
  }

  async updateCoinifyOrder(order: any): Promise<void> {
    const status = order?.data?.state
    if (status === PaymentStatus.Complete || status === PaymentStatus.Expired) {
      const { re_id } = order?.data?.custom
      await this.sqsService.publishToSQS(
        { ...order?.data?.custom, status, type: SQSType.ORDER },
        AWS_SQS_QUEUE_URL,
        `${re_id}#RE`,
      )
    }
  }

  async updateStripeOrder(
    order: any,
    request: Request,
    _hostname: string,
  ): Promise<void> {
    Logger.log(`updateStripe order inside the function. ${JSON.stringify(order)}`)
    let event: any = {}
    try {
      const payloadString = JSON.stringify(request?.body, null, 2)
      const header = this.stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: STRIPE_WEBHOOK_SECRET,
      })
      event = this.stripe.webhooks.constructEvent(
        payloadString,
        header,
        STRIPE_WEBHOOK_SECRET,
      )
    } catch (err) {
      Logger.error(`Getting the error while construct event:${JSON.stringify(err)}`)
      return
    }
    let paymentIntentObj = null
    let status = ''
    // Handle the event
    if (event.type === 'checkout.session.async_payment_failed') {
      status = PaymentStatus.Failed
    } else if (event.type === 'checkout.session.completed') {
      status = PaymentStatus.Complete
    } else if (event.type === 'checkout.session.expired') {
      status = PaymentStatus.Expired
    } else {
      Logger.log(`Unhandled event type, so returning. ${event.type}`)
      return
    }
    paymentIntentObj = event.data.object
    Logger.log(`paymentIntent response object ${JSON.stringify(paymentIntentObj)}`)
    const { re_id } = paymentIntentObj?.metadata
    await this.sqsService.publishToSQS(
      { ...paymentIntentObj?.metadata, status, type: SQSType.ORDER },
      AWS_SQS_QUEUE_URL,
      `${re_id}#RE`,
    )
  }

  async receivePandaDocEvent(pandaDocEvent: any): Promise<void> {
    Logger.log(
      `Processing the Pandadoc webhook response ${JSON.stringify(pandaDocEvent)}`,
    )
    const resp = pandaDocEvent[0]
    if (resp.event === 'recipient_completed') {
      Logger.log(
        `publishing to pandadoc queue, re_id, user_id, order_id , ${JSON.stringify({
          ...resp?.data?.metadata,
        })}`,
      )
      await this.sqsService.publishToSQS(
        { ...resp?.data?.metadata, type: SQSType.PANDADOC },
        PANDA_DOC_SQS_QUEUE,
        'PandaDocMessageGroupId',
      )
    }
  }

  async receiveDocumentChangeEvent(pandaDocEvent: any): Promise<void> {
    Logger.log(`Processing receiveDocumentChangeEvent ${JSON.stringify(pandaDocEvent)}`)
    const resp = pandaDocEvent[0]
    if (resp.event === 'document_state_changed') {
      const status = resp.data.status
      const documentId = resp?.data?.id
      Logger.log(
        `publishing to pandadoc queue, re_id, user_id, order_id , ${JSON.stringify({
          ...resp?.data?.metadata,
        })}`,
      )
      Logger.log(`status & document Id : ${status} ${documentId}`)
      if (status === 'document.draft') {
        await this.pandadocService.sendDocument(documentId)
      }
    }
  }
}
