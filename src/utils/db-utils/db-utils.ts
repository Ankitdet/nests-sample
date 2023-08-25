import { dbLogger } from '@const/common.const'
import { getDynamoDbClient } from '@db/core/dynamo-client'
import { logger } from '@shared/logger/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import _ from 'lodash'
import {
  convertObjectToCamelCase,
  convertObjectToSnakeCase,
  validaAndFormatDateString,
} from '..'

export const todayDate = validaAndFormatDateString(new Date().toISOString())
/*
const _resp = await update({
      TableName: 'ddb-3blk-dev-uea1-3blocks-Backend5',
      Key: { pk: '#RE#f6372632-dd4f-4694-ad99-ac06f277cbb4', sk: '#PROP' },
      UpdateExpression: "SET my_value = if_not_exists(my_value, :start) + :inc",
      ExpressionAttributeValues: {
        ':inc': 10,
        ':start': 0,
      },
      ReturnValues: "UPDATED_NEW"
    })
    return _resp
*/
export const generateUpdateQuery = async (
  { updates },
  isCamelCase = false,
): Promise<any> => {
  updates = {
    ...updates,
    updated_at: todayDate,
  }
  if (isCamelCase) {
    updates = convertObjectToSnakeCase(updates)
  }
  const keys = Object.keys(updates)
  const keyNameExpressions = keys.map(name => `#${name}`)
  const keyValueExpressions = keys.map(value => `:${value}`)
  const UpdateExpression =
    'set ' +
    keyNameExpressions
      .map((nameExpr, idx) => `${nameExpr} = ${keyValueExpressions[idx]}`)
      .join(', ')
  const ExpressionAttributeNames = keyNameExpressions.reduce(
    (exprs, nameExpr, idx) => ({ ...exprs, [nameExpr]: keys[idx] }),
    {},
  )
  const ExpressionAttributeValues = keyValueExpressions.reduce(
    (exprs, valueExpr, idx) => ({ ...exprs, [valueExpr]: updates[keys[idx]] }),
    {},
  )
  return {
    ReturnValues: 'ALL_NEW',
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  }
}

export const generateProjectionQueryFromReq = async (query: any): Promise<any> => {
  if (_.isEmpty(query) || !query || _.isUndefined(query)) return {}
  const keys = Object.keys(query)
  if (_.isEmpty(keys)) return {}
  const keyNameExpressions = keys.map(name => `#${name}`)
  const ProjectionExpression = keyNameExpressions
    .map(nameExpr => `${nameExpr}`)
    .join(', ')
  const ExpressionAttributeNames = keyNameExpressions.reduce(
    (exprs, nameExpr, idx) => ({ ...exprs, [nameExpr]: keys[idx] }),
    {},
  )
  logger.info(`Asking for projection: ${JSON.stringify(ExpressionAttributeNames)}`)
  return {
    ProjectionExpression,
    ExpressionAttributeNames,
  }
}
/*
 * Edit item in DynamoDB table or inserts new if not existing
 * @param {string} tableName // Name of the target table
 * @param {string} pk // partition key of the item ( necessary for new inserts but not modifiable by the update/edit)
 * @param {object} item // Object containing all the props for new item or updates for already existing item
 */
export const addOrUpdate = async (
  tableName: string,
  item: any,
  pk: string,
): Promise<any> => {
  const itemKeys = Object.keys(item).filter(k => k !== pk)
  const params = {
    TableName: tableName,
    UpdateExpression: `SET ${itemKeys
      .map((_k, index) => `#field${index} = :value${index}`)
      .join(', ')}`,
    ExpressionAttributeNames: itemKeys.reduce(
      (accumulator, k, index) => ({
        ...accumulator,
        [`#field${index}`]: k,
      }),
      {},
    ),
    ExpressionAttributeValues: itemKeys.reduce(
      (accumulator, k, index) => ({
        ...accumulator,
        [`:value${index}`]: item[k],
      }),
      {},
    ),
    Key: {
      [pk]: item[pk],
    },
    ReturnValues: 'ALL_NEW',
  }
  return params
}

// https://stackoverflow.com/questions/42765437/pagination-in-dynamodb-using-node-js

export const update = async (
  input: DocumentClient.UpdateItemInput,
  isCamelCase = false,
): Promise<any> => {
  const client = getDynamoDbClient()
  try {
    let resp = await client
      .update(input)
      .promise()
      .then(d => {
        return d.Attributes
      })
      .catch(e => {
        throw e
      })
    if (isCamelCase) {
      resp = convertObjectToCamelCase(resp)
    }
    dbLogger().log(`[Update] ${JSON.stringify(resp)}`)
    return resp
  } catch (error) {
    logger.error('Error while performing the update operation:', error)
    throw error
  } finally {
    logger.info('[Update] operation is done.')
  }
}

export const put = async (
  input: DocumentClient.PutItemInput,
  isCamelCase = false,
): Promise<void> => {
  const client = getDynamoDbClient()

  let item = {}
  if (isCamelCase) {
    item = convertObjectToSnakeCase(input.Item)
  } else {
    item = input.Item
  }
  item['created_at'] = todayDate
  item['updated_at'] = todayDate
  try {
    await client
      .put({
        TableName: input.TableName,
        ...input,
        Item: item,
      })
      .promise()
      .catch(e => {
        throw e
      })
    dbLogger().log(`[Put]`)
  } catch (error) {
    logger.error('Error while performing the put operation:', error)
    throw error
  } finally {
    logger.info('[PUT] operation is done.')
  }
}

export const get = async (
  input: DocumentClient.GetItemInput,
  isCamelCase = false,
): Promise<any> => {
  const client = getDynamoDbClient()
  try {
    let getResponse = await client
      .get(input)
      .promise()
      .then(data => {
        return data.Item
      })
      .catch(e => {
        throw e
      })
    if (isCamelCase) {
      getResponse = convertObjectToCamelCase(getResponse)
    }
    dbLogger().log(`[Get],${JSON.stringify(getResponse)}`)
    return getResponse
  } catch (error) {
    logger.error('Error while performing the get operation:', error)
    throw error
  } finally {
    logger.info('[GET] operation is done.')
  }
}

export const scan = async (
  input: DocumentClient.ScanInput,
  isCamelCase = false,
): Promise<any> => {
  const client = getDynamoDbClient()
  try {
    let getResponse = await client
      .scan(input)
      .promise()
      .then(data => {
        return data.Items
      })
      .catch(e => {
        throw e
      })
    if (isCamelCase) {
      getResponse = getResponse.map(element => convertObjectToCamelCase(element))
    }
    return getResponse
  } catch (error) {
    logger.error('Error while performing the get operation:', error)
    throw error
  } finally {
    logger.info('[SCAN] operation is done.')
  }
}
export const query = async (
  input: DocumentClient.QueryInput,
  isCamelCase = false,
): Promise<any> => {
  const client = getDynamoDbClient()
  try {
    let queryResult = await client
      .query(input)
      .promise()
      .then(data => {
        return data.Items
      })
      .catch(e => {
        throw e
      })
    if (isCamelCase) {
      queryResult = queryResult.map(element => convertObjectToCamelCase(element))
    }
    dbLogger().log(`[Query],${JSON.stringify(queryResult)}`)
    return queryResult
  } catch (error) {
    logger.error('Error while performing the query operation:', error)
    throw error
  } finally {
    logger.info('[Query] operation is done.')
  }
}

export const deleteQuery = async (
  input: DocumentClient.DeleteItemInput,
): Promise<void> => {
  const client = getDynamoDbClient()
  try {
    await client
      .delete(input)
      .promise()
      .catch(e => {
        throw e
      })
    dbLogger().log(`[Delete]`)
  } catch (error) {
    logger.error('Error while performing the query operation:', error)
    throw error
  } finally {
    logger.info('[Delete] operation is done.')
  }
}

const LIMIT = 10
export const getPaginatedData = async (
  params:
    | AWS.DynamoDB.DocumentClient.QueryInput
    | AWS.DynamoDB.DocumentClient.ScanInput,
  key?: any,
) => {
  const client = getDynamoDbClient()
  const getAllData = async (
    params:
      | AWS.DynamoDB.DocumentClient.QueryInput
      | AWS.DynamoDB.DocumentClient.ScanInput,
    startKey?: any,
  ) => {
    if (startKey) {
      params.ExclusiveStartKey = startKey
    }
    return client.scan(params).promise()
  }
  const rows = {
    items: [],
    key: {},
  }
  let count = 0
  do {
    /*
    ScannedCount — the number of items that matched the key condition expression,
    before a filter expression (if present) was applied.
    Count — the number of items that remain, after a filter expression (if present) was applied.***/
    const result = await getAllData(params, key)
    count += result.Count
    rows.items = [...rows.items, ...result.Items]
    if (count > LIMIT) {
      const itemRemove = Math.abs(LIMIT - count)
      rows.items.splice(rows.items.length - itemRemove, itemRemove)
      rows.key = result.LastEvaluatedKey
    } else {
      key = result.LastEvaluatedKey
    }
  } while (count < LIMIT + 1)
  return rows
}

/*
export function searchBlogByTitle(query: string, itemsPerPage: number, lastEvaluatedKey?: string): Promise<any> {
  let params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: DB_TABLE_NAME,
    FilterExpression: "begins_with(#bef90, :bef90) And begins_with(#bef91, :bef91)",
    "ExpressionAttributeValues": {
      ":bef90": "#RE",
      ":bef91": "#PROP",
    },
    "ExpressionAttributeNames": {
      "#bef90": "pk",
      "#bef91": "sk"
    },
  };
  params.Limit = itemsPerPage;
  if (lastEvaluatedKey) {
    let keyValues = lastEvaluatedKey.toString().split(",");
    // set ExclusiveStartKey only when server get complete lastEvaluatedKey as sent by it
    if (keyValues.length === 1) {
      params.ExclusiveStartKey = {
        pk: keyValues[0],
      };
    }
  }
  return performPaginatedOperation(params, query, ["pk"]);
}
export function performPaginatedOperation(params: AWS.DynamoDB.DocumentClient.QueryInput
  | AWS.DynamoDB.DocumentClient.ScanInput,
  operationName: string, tableLastEvaluatedKeyFieldNames: Array<string>): Promise<Object> {

  let DatabaseProvider = getDynamoDbClient()
  return new Promise((resolve, reject) => {
    const dataWithKey = {
      lastEvaluatedKey: undefined,
      result: []
    };
    // adding 1 extra items due to a corner case bug in DynamoDB, find details below.
    const originalItemPerPageCount = params.Limit;
    params.Limit = params.Limit + 1;
    let remainingItemsCount = 0;
    // DatabaseProvider.getDocumentClient() should give us the dynamoDB DocumentClient object
    // How to get DocumentClient:
    http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.01
    DatabaseProvider[operationName](params, onScan);
    function onScan(err, data) {
      if (err) {
        return reject(err);
      }
      dataWithKey.result = dataWithKey.result.concat(data.Items);
      remainingItemsCount = (originalItemPerPageCount + 1) - dataWithKey.result.length;
      if (remainingItemsCount > 0) {
        if (typeof data.LastEvaluatedKey === "undefined") {
          // pagination done, this is the last page as LastEvaluatedKey is undefined
          return resolve(dataWithKey);
        } else {
          // Continuing pagination for more data
          // as we didnot get our desired itemsPerPage. Remember ScannedCount and Count fields!!
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          params.Limit = remainingItemsCount;
          DatabaseProvider[operationName](params, onScan);
        }
      } else {
        dataWithKey.result = dataWithKey.result.slice(0, originalItemPerPageCount);
        // pagination done, but this is not the last page. making lastEvaluatedKey to
        // send to browser
        dataWithKey.lastEvaluatedKey = prepareLastEvaluatedKeyString(
          dataWithKey.result[originalItemPerPageCount - 1], tableLastEvaluatedKeyFieldNames);
        return resolve(dataWithKey);
      }
    }
  });
}
// Preparing lastEvaluatedKey as comma seperated values of lastEvaluatedKey fields
function prepareLastEvaluatedKeyString(dataObj: Object, tableLastEvaluatedKeyFieldNames: Array<string>) {
  let key = "";
  tableLastEvaluatedKeyFieldNames.forEach((field: string) => {
    key += dataObj[field] + ",";
  });
  if (key !== "") {
    key = key.substr(0, key.length - 1);
  }
  return key;
} */
