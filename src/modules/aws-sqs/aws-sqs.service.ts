import { SQSType } from '@const/common.const'
import {
  AWS_CREDENTIAL,
  AWS_REGION,
  AWS_SQS_QUEUE_URL,
  PANDA_DOC_SQS_QUEUE,
} from '@const/environments'
import { Injectable } from '@nestjs/common'
import { logger } from '@shared/logger/logger'
import { SQSRecord } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { CheckoutService } from '../checkout/checkout.service'
import { BlockchainService } from '../integration/blockchain/blockchain.service'

@Injectable()
export class AWSSqsService {
  private readonly sqs: AWS.SQS
  constructor(
    private readonly alchemyService: BlockchainService,
    private readonly checkoutService: CheckoutService,
  ) {
    this.sqs = new AWS.SQS({
      ...AWS_CREDENTIAL,
      region: AWS_REGION,
    })
  }

  async publishToSQS(
    body: any,
    queueUrl: string,
    messageGroupId: string,
  ): Promise<void> {
    try {
      const queueRes = await this.sqs
        .sendMessage({
          MessageGroupId: messageGroupId,
          MessageBody: JSON.stringify(body),
          QueueUrl: queueUrl,
        })
        .promise()
      logger.info(`Pandadoc - publishing to queue,${JSON.stringify(queueRes)}`)
    } catch (e) {
      logger.info(e)
      throw e
    }
  }

  async deleteMessageFromSqs(queueUrl: string, message: SQSRecord): Promise<void> {
    logger.info('Deleting the message from Sqs Queue')
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: message.receiptHandle,
    }
    this.sqs.deleteMessage(deleteParams, function (err, data) {
      if (err) {
        this.sqsLogger.error('Delete Error', err)
      } else {
        this.sqsLogger.log('Message Deleted', data)
      }
    })
  }

  public async processingQueue(orders: SQSRecord[]) {
    let queueUrl = ''
    logger.info(`Processing message counts. ${orders.length}`)
    for (const record of orders) {
      const { type } = JSON.parse(record.body)
      if (type === SQSType.ORDER) {
        await this.checkoutService.updateCoinifyOrder(record)
        queueUrl = AWS_SQS_QUEUE_URL
      } else if (type === SQSType.PANDADOC) {
        const { order_id, re_id, user_id, totalNumberOfTokens } = JSON.parse(
          record?.body,
        )
        const resp = await this.alchemyService.tokenTransfer(
          Number(totalNumberOfTokens),
          order_id,
          re_id,
          user_id,
        )
        logger.info(`tokenTransfer completed success.: ${JSON.stringify(resp)}`)
        queueUrl = PANDA_DOC_SQS_QUEUE
      }
      await this.deleteMessageFromSqs(queueUrl, record)
    }
  }
}
