import { DynamoDB } from 'aws-sdk'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../../shared/logger/logger'

export abstract class DynamoBase {
  static uuid: string = ''
  get uuid(): string {
    return DynamoBase.uuid
  }
  set uuid(id: string) {
    DynamoBase.uuid = id
  }

  public keys(): string {
    this.uuid = uuidv4()
    return this.uuid
  }

  // Remove keys is not required everytime.
  toCreateItems(removeKeys?: any): Record<string, unknown> {
    logger.info(removeKeys)
    return undefined
  }
  toUpdateItems(removeKeys?: any): Record<string, unknown> {
    logger.info(removeKeys)
    return undefined
  }
  toDeleteItems(removeKeys?: any): Record<string, unknown> {
    logger.info(removeKeys)
    return undefined
  }
}

type executeTransactWriteInput = {
  client: DynamoDB
  params: DynamoDB.Types.TransactWriteItemsInput
}

// Thanks, Paul Swail! https://github.com/aws/aws-sdk-js/issues/2464#issuecomment-503524701
export const executeTransactWrite = async ({
  client,
  params,
}: executeTransactWriteInput) => {
  const transactionRequest = client.transactWriteItems(params)
  let cancellationReasons
  transactionRequest.on('extractError', response => {
    try {
      cancellationReasons = JSON.parse(
        response.httpResponse.body.toString(),
      ).CancellationReasons
    } catch (err) {
      // suppress this just in case some types of errors aren't JSON parseable
      // console.error("Error extracting cancellation error", err)
    }
  })
  return new Promise((resolve, reject) => {
    transactionRequest.send((err, response) => {
      if (err) {
        /* tslint:disable-next-line */
        err[`cancellationReasons`] = cancellationReasons
        return reject(err)
      }
      return resolve(response)
    })
  })
}
