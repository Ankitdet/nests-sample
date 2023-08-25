import { getDynamoDbClient } from '@db/core/dynamo-client'
import { Logger } from '@nestjs/common'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import _ from 'lodash'

// perform a scan and return a generator that yields each page of Items
export async function* fullScanSeq<I extends DocumentClient.AttributeMap>(
  docClient: DocumentClient,
  params: DocumentClient.QueryInput,
) {
  while (true) {
    const data = await docClient.query(params).promise()

    if (data.Items && data.Items.length) {
      const items = data.Items as I[]
      yield* items
    }

    if (data.LastEvaluatedKey === undefined) {
      break
    }

    params = { ...params, ExclusiveStartKey: data.LastEvaluatedKey }
  }
}

// allow full scan in one promise function
export async function paginatedRecords<I extends DocumentClient.AttributeMap>(
  params: DocumentClient.QueryInput,
  nextCursor: any,
  limit: number,
  maxDepth = -1,
  sleepWait = 0,
) {
  const docClient = getDynamoDbClient()
  const row = {
    items: [],
    key: {},
    count: 0,
  }

  if (nextCursor && !_.isEmpty(nextCursor)) {
    params.ExclusiveStartKey = nextCursor
  }

  if (!maxDepth) {
    return row.items
  }

  while (true) {
    if (maxDepth > 0) {
      maxDepth--
    }
    const data = await docClient.query(params).promise()
    row.items.push.apply(row.items, data.Items as I[])
    row.key = data.LastEvaluatedKey

    if (limit === row.items.length) {
      break
    }

    if (maxDepth === 0 || data.LastEvaluatedKey === undefined) {
      break
    }

    Logger.log(`scanning for more... ${data.LastEvaluatedKey}`)
    params = { ...params, ExclusiveStartKey: data.LastEvaluatedKey }

    if (sleepWait) {
      await sleep(sleepWait)
    }
  }
  row.count = row.items.length
  return row
}

// Helpers
async function sleep(delayMs: number): Promise<undefined> {
  return new Promise(() => {
    setTimeout(() => {
      Logger.log('sleep for ', delayMs)
    }, delayMs)
  })
}

export const newQuery = async (params: DocumentClient.QueryInput) => {
  const docClient = getDynamoDbClient()

  const scanResults = []
  let items
  do {
    items = await docClient.query(params).promise()
    items.Items.forEach(item => scanResults.push(item))
    params.ExclusiveStartKey = items.LastEvaluatedKey
  } while (typeof items.LastEvaluatedKey !== 'undefined')

  return scanResults
}
