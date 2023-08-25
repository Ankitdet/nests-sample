import { DB_TABLE_NAME } from '@const/environments'
import { IRealEstateListing } from '@core/interfaces'
// import { Paginated } from '@core/interfaces/dynamodb/paginated.interface'
import { RealEstateFinanceSchema } from '@core/schemas'
import { RealEstateSchema } from '@core/schemas/real-estate/real-estate.schema'
import { DynamoBase } from '@db/core/dynamo-base'
import { getDynamoDbClient } from '@db/core/dynamo-client'
import { HttpStatus } from '@nestjs/common'
import { BaseError } from '@shared/errors'
import { deleteDynamoDBKeys, getObject, IS_CAMEL_CASE } from '@utils/common.utils'
// import { paginatedRecords } from '@utils/db-utils/paginated'
import { generateUpdateQuery, get, put, query, update } from '@utils/index'
import { listObjectMapper, mapToObject } from '@utils/mapper/real-estate-data-mapper'
import AWS from 'aws-sdk'
import _ from 'lodash'
import { logger } from '../../shared/logger/logger'
import {
  AccessPatternMatrix,
  StartsWith,
  ValueFor,
} from '../core/dyanamo-access-pattern'
import { IndexName, Keys } from '../core/dynamo-enum'

export class PropertyInfoDynamo extends DynamoBase {
  realEstateDb: RealEstateSchema
  get gsi2_sk(): string {
    return undefined
  }

  get re_id_gsi1_sk(): string {
    this.realEstateDb.re_id = this.uuid
    return AccessPatternMatrix().real_estate_info.gsi1_sk.replace(
      ValueFor.reId,
      this.realEstateDb.re_id,
    )
  }
  get user_id_gsi1_pk(): string {
    return AccessPatternMatrix().real_estate_info.gsi1_pk.replace(
      ValueFor.userId,
      this.realEstateDb.userId,
    )
  }

  get address_gsi2_pk(): string {
    return AccessPatternMatrix()
      .real_estate_info.gsi2_pk.replace('ADD', this.realEstateDb.add.toUpperCase())
      .replace('STATE', this.realEstateDb.state.toUpperCase())
      .replace('CITY', this.realEstateDb.city.toUpperCase())
      .replace('ZIP', String(this.realEstateDb.zip).toUpperCase())
      .toUpperCase()
  }

  get re_id_pk(): string {
    return AccessPatternMatrix().real_estate_info.pk.replace(ValueFor.reId, this.uuid)
  }

  get re_id_update_pk(): string {
    return AccessPatternMatrix().real_estate_info.pk.replace(
      ValueFor.reId,
      this.realEstateDb.re_id,
    )
  }

  get prop_sk(): string {
    return AccessPatternMatrix().real_estate_info.sk
  }

  constructor(realEstateInfo: RealEstateSchema) {
    super()
    this.realEstateDb = realEstateInfo
  }

  toItem(removeKeys?: any): Record<string, unknown> {
    const keys = this.keys()
    deleteDynamoDBKeys(keys, removeKeys)
    const data = {
      [Keys.PK]: this.re_id_pk,
      [Keys.SK]: this.prop_sk,
      [Keys.GSI1_PK]: this.user_id_gsi1_pk,
      [Keys.GSI1_SK]: this.re_id_gsi1_sk,
      [Keys.GSI2_PK]: this.address_gsi2_pk,
      ...this.realEstateDb,
    }
    return data
  }
}

export const createRealEstateData = async (
  realEstate: PropertyInfoDynamo,
): Promise<IRealEstateListing> => {
  const client = getDynamoDbClient()
  try {
    await client
      .put({
        TableName: DB_TABLE_NAME,
        Item: realEstate.toItem([Keys.GSI2_SK]),
      })
      .promise()
      .catch(e => {
        throw e
      })
    const convertedData = mapToObject(realEstate)
    return convertedData
  } catch (error) {
    throw error
  }
}

export const createRealEstateDataFromUI = async (
  realEstate: PropertyInfoDynamo,
): Promise<IRealEstateListing> => {
  try {
    await put(
      {
        TableName: DB_TABLE_NAME,
        Item: realEstate.toItem([Keys.GSI2_SK, Keys.GSI2_PK]),
      },
      IS_CAMEL_CASE,
    )
    const convertedData = mapToObject(realEstate)
    return convertedData
  } catch (error) {
    logger.error(error)
    throw error
  }
}

// All properties created by logged In user
export const fetchRealEstateDataByUserId = async (
  user_id: string,
): Promise<IRealEstateListing> => {
  try {
    const realestate = await get(
      {
        TableName: DB_TABLE_NAME,
        Key: {
          pk: user_id,
        },
      },
      IS_CAMEL_CASE,
    )
    const unmarshalled = AWS.DynamoDB.Converter.unmarshall(realestate.Item, {
      convertEmptyValues: true,
    })
    return unmarshalled
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export const fetchProperty = async (
  formatted_street_address: string,
  city: string,
  state: string,
  zipCode: number,
): Promise<IRealEstateListing> => {
  try {
    const address = AccessPatternMatrix()
      .real_estate_info.gsi2_pk.replace('ADD', formatted_street_address)
      .replace('STATE', state)
      .replace('CITY', city)
      .replace('ZIP', String(zipCode))
      .toUpperCase()
    const realestate = await query(
      {
        TableName: DB_TABLE_NAME,
        IndexName: IndexName.GSI_2,
        KeyConditionExpression: `#gsi2_pk = :address`,
        ExpressionAttributeNames: {
          '#gsi2_pk': Keys.GSI2_PK,
        },
        ExpressionAttributeValues: {
          ':address': address,
        },
      },
      IS_CAMEL_CASE,
    )
    logger.info(`Response after query executed:  ${JSON.stringify(realestate[0])}`)
    if (_.isEmpty(realestate[0])) {
      return undefined
    }
    const convertedData = mapToObject({ realEstateDb: realestate[0] })
    return convertedData
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export const getRealEstateFinanceByReId = async (
  re_id: string,
  _req?: any,
): Promise<any> => {
  const reId = AccessPatternMatrix().real_estate_info.pk.replace(ValueFor.reId, re_id)
  const sk = AccessPatternMatrix().real_estate_info.sk
  // const projectionQuery = await generateProjectionQueryFromReq(req)
  logger.info(`Print the table name ${DB_TABLE_NAME}`)
  const realestate: RealEstateFinanceSchema = await get(
    {
      TableName: DB_TABLE_NAME,
      Key: {
        [Keys.PK]: reId,
        [Keys.SK]: sk,
      },
      // ...projectionQuery,
    },
    IS_CAMEL_CASE,
  )
  if (!realestate) {
    throw new BaseError(
      HttpStatus.NOT_FOUND,
      `real estate data not found for given re id : ${re_id}`,
    )
  }
  logger.info(`Response after query executed: ${JSON.stringify(realestate)}`)
  return realestate
}

export const updateSmartContractDB = async (prop: PropertyInfoDynamo) => {
  const input: RealEstateSchema = {
    ...prop.realEstateDb,
  }
  const returnType = await generateUpdateQuery({ updates: input }, IS_CAMEL_CASE)
  return await update(
    {
      TableName: DB_TABLE_NAME,
      Key: {
        [Keys.PK]: prop.re_id_update_pk,
        [Keys.SK]: prop.prop_sk,
      },
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
}

export const getRealEstateBasicInfoById = async (
  prop: PropertyInfoDynamo,
): Promise<RealEstateSchema> => {
  const client = getDynamoDbClient()

  const data = await client
    .get({
      TableName: DB_TABLE_NAME,
      Key: {
        [Keys.PK]: prop.re_id_update_pk,
        [Keys.SK]: prop.prop_sk,
      },
    })
    .promise()
    .then(d => d.Item)
    .catch(e => {
      throw e
    })
  if (!data) {
    return Promise.resolve({})
  }
  const convertedData = mapToObject({ realEstateDb: data })
  return convertedData
}

export const getRealEstateByReId = async (
  realEstateFinance: RealEstateSchema,
): Promise<RealEstateSchema> => {
  const obj = getObject(PropertyInfoDynamo, realEstateFinance)
  return await get(
    {
      TableName: DB_TABLE_NAME,
      Key: {
        [Keys.PK]: obj.re_id_update_pk,
        [Keys.SK]: obj.prop_sk,
      },
    },
    IS_CAMEL_CASE,
  )
}

export const holdTokens = async (prop: RealEstateSchema): Promise<RealEstateSchema> => {
  const obj = getObject(PropertyInfoDynamo, prop)
  const input: RealEstateSchema = {
    ...obj.realEstateDb,
  }
  const returnType = await generateUpdateQuery({ updates: input }, IS_CAMEL_CASE)
  return await update(
    {
      TableName: DB_TABLE_NAME,
      Key: {
        [Keys.PK]: obj.re_id_update_pk,
        [Keys.SK]: obj.prop_sk,
      },
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
}

export const unholdTokens = async (
  realEstateFinance: RealEstateSchema,
): Promise<void> => {
  const obj = getObject(PropertyInfoDynamo, realEstateFinance)
  const updateQuertData = await generateUpdateQuery(
    {
      updates: obj.realEstateDb,
    },
    IS_CAMEL_CASE,
  )
  const client = getDynamoDbClient()
  try {
    const resp = await client
      .transactWrite({
        TransactItems: [
          {
            Update: {
              TableName: DB_TABLE_NAME,
              Key: {
                pk: obj.re_id_update_pk,
                sk: obj.prop_sk,
              },
              ...updateQuertData,
            },
          },
        ],
      })
      .promise()
      .then(d => {
        return d.$response.data
      })
      .catch(e => {
        logger.error(e)
        throw e
      })
    logger.info(`Unhold Tokens: done. ${JSON.stringify(resp)}`)
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export const getRealEstateInfoList = async (reIds: [string]): Promise<any> => {
  const client = getDynamoDbClient()
  let filterExpression = ''
  let values = {}
  reIds.forEach((b, index) => {
    filterExpression += `:${index + 1},`
    values = {
      ...values,
      [`:${index + 1}`]: `#RE#${b}`,
    }
  })

  filterExpression = filterExpression.slice(0, -1)
  try {
    let realEstate = await client
      .scan({
        TableName: DB_TABLE_NAME,
        FilterExpression: `#a0 IN (${filterExpression}) And begins_with(#sk, :sk)`,
        ExpressionAttributeNames: {
          '#a0': Keys.PK,
          '#sk': Keys.SK,
        },
        ExpressionAttributeValues: {
          ...values,
          ':sk': StartsWith.RPOP,
        },
      })
      .promise()
      .then(d => {
        return d.Items
      })
      .catch(e => {
        throw e
      })

    realEstate = realEstate.map(re => listObjectMapper({ realEstateDb: re }))
    return realEstate
  } catch (e) {
    throw e
  }
}
/*
Pagination:TODO
export const getRealEstateInfoListWithoutIds = async (
  query: Paginated,
): Promise<any> => {
  logger.info(`DB table name: ${DB_TABLE_NAME}`)
  const { limit = 20, nextCursor } = query
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: DB_TABLE_NAME,
    ScanIndexForward: true,
    IndexName: 'GSI_1',
    KeyConditionExpression: '#bef91 = :bef91',
    FilterExpression: 'attribute_exists(#token_id)',
    ExpressionAttributeValues: {
      ':bef91': '#PROP',
    },
    ProjectionExpression:
      '#created_at,#updated_at,#re_id,#add,#listing_price,#total_number_of_tokens,#token_price,#expected_net_roi,#tokens_remaining,#token_id',
    ExpressionAttributeNames: {
      '#bef91': 'sk',
      '#add': 'add',
      '#listing_price': 'listing_price',
      '#total_number_of_tokens': 'total_number_of_tokens',
      '#token_price': 'token_price',
      '#expected_net_roi': 'expected_net_roi',
      '#re_id': 're_id',
      '#created_at': 'created_at',
      '#updated_at': 'updated_at',
      '#tokens_remaining': 'tokens_remaining',
      '#token_id': 'token_id',
    },
    Limit: limit,
  }
  const realEstate: any = await paginatedRecords(params, nextCursor, limit)
 */

export const getRealEstateInfoListWithoutIds = async (): Promise<any> => {
  const client = getDynamoDbClient()

  logger.info(`DB table name: ${DB_TABLE_NAME}`)
  const realEstate = await client
    .scan({
      TableName: DB_TABLE_NAME,
      ConsistentRead: false,
      FilterExpression: 'begins_with(#d7ed0, :d7ed0) And begins_with(#d7ed1, :d7ed1)',
      ProjectionExpression:
        '#created_at,#updated_at,#re_id,#add,#listing_price,#total_number_of_tokens,#token_price,#expected_net_roi,#tokens_remaining,#token_id',
      ExpressionAttributeValues: {
        ':d7ed0': '#RE#',
        ':d7ed1': '#PROP',
        // ':listing_price': 'listing_price'
      },
      // #total_number_of_tokens, #token_price, #expected_net_roi"
      ExpressionAttributeNames: {
        '#d7ed0': Keys.PK,
        '#d7ed1': Keys.SK,
        '#add': 'add',
        '#listing_price': 'listing_price',
        '#total_number_of_tokens': 'total_number_of_tokens',
        '#token_price': 'token_price',
        '#expected_net_roi': 'expected_net_roi',
        '#re_id': 're_id',
        '#created_at': 'created_at',
        '#updated_at': 'updated_at',
        '#tokens_remaining': 'tokens_remaining',
        '#token_id': 'token_id',
      },
    })
    .promise()
    .then(d => {
      return d.Items
    })
    .catch(e => {
      throw e
    })
  const resp = []
  /*   if (realEstate.items.length > 0) {
      realEstate.items.forEach(e => { */
  if (realEstate.length > 0) {
    realEstate.forEach(e => {
      let a = 0
      if (e?.tokens_remaining) {
        a = e?.tokens_remaining
      } else {
        if (e?.tokens_remaining === undefined) {
          a = e?.total_number_of_tokens
        }
      }
      if (e?.token_id) {
        resp.push({
          re_id: e.re_id,
          address: e?.add,
          created_at: e?.created_at || e.updated_at,
          updated_at: e?.updated_at,
          listingPrice: e?.listing_price,
          totalNumberOfTokens: e.total_number_of_tokens,
          tokenPrice: e.token_price,
          expectedNetRoi: e.expected_net_roi,
          tokensRemaining: a,
        })
      }
    })
  }
  // return { reData: resp, nextCursor: realEstate.key }
  return resp
}
