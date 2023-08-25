import { COMPANY_RE_DB, ZILLOW_DIGITAL_RE_DB } from '@const/environments'
import { CompanyUrls, PlatformName } from '@core/enums/index'
import { DigitalArtworkInf, DigitalBondsInf } from '@core/interfaces'
import { Paginated } from '@core/interfaces/dynamodb/paginated.interface'
import { ZillowDigitalDBSchema } from '@core/schemas'
import { ErrorHandleAndThrow } from '@shared/errors/axios-errors'
import { logger } from '@shared/logger/logger'
import {
  generateUpdateQuery,
  get,
  getObject,
  newQuery,
  paginatedRecords,
  // paginatedRecords,
  put,
  query,
  update,
} from '@utils/index'
import * as AWS from 'aws-sdk'
import _ from 'lodash'
import { uuid } from 'uuidv4'
import {
  AccessPatternMatrix,
  StartsWith,
  ValueFor,
} from '../core/dyanamo-access-pattern'
import { DynamoBase } from '../core/dynamo-base'
import { getDynamoDbClient } from '../core/dynamo-client'
import { IndexName, Keys } from '../core/dynamo-enum'
export class ZillowDigitalReDB extends DynamoBase {
  zillowDb: ZillowDigitalDBSchema

  constructor(zillowDb: ZillowDigitalDBSchema) {
    super()
    this.zillowDb = zillowDb
  }

  get pk() {
    return AccessPatternMatrix().zillowDigitalRE.pk.replace(
      ValueFor.zillowId,
      this.keys(),
    )
  }

  get sk() {
    return AccessPatternMatrix().zillowDigitalRE.sk
  }

  toSaveZillowRecordInDB(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.pk,
      [Keys.SK]: this.sk,
      zillow: this.zillowDb,
    }
    return data
  }
}

export const saveZillowRecordInDB = async (zillow: ZillowDigitalDBSchema) => {
  const zilloObj = getObject(ZillowDigitalReDB, zillow)
  await put({
    TableName: ZILLOW_DIGITAL_RE_DB,
    Item: zilloObj.toSaveZillowRecordInDB(),
  })
  return zilloObj
}

export const getExistingReData = async (): Promise<any> => {
  const data = await listDigitalReDB()
  return data
}

export const queryDataByAddress = async (address: string): Promise<any> => {
  const data = await query({
    TableName: ZILLOW_DIGITAL_RE_DB,
    ScanIndexForward: true,
    IndexName: IndexName.GSI_1,
    KeyConditionExpression: '#766a0 = :766a0 And  begins_with(#44371, :44371)',
    ExpressionAttributeValues: {
      ':766a0': '#DRE#',
      ':44371': address,
    },
    ExpressionAttributeNames: {
      '#766a0': Keys.GSI1_PK,
      '#44371': Keys.GSI1_SK,
    },
  })
  return data
}

export const updateBlockchainData = async (blckn: any, { pk, sk }): Promise<any> => {
  const num = await generateUpdateQuery({ updates: blckn })
  await update({
    Key: {
      [Keys.PK]: pk,
      [Keys.SK]: sk,
    },
    TableName: ZILLOW_DIGITAL_RE_DB,
    ...num,
  })
  logger.info('update BlockchainData in DB done !!!')
}

export const createDataIntoDigitalDebt = async (input: any): Promise<any> => {
  const debtId = uuid()
  let contractAddress = ''
  if (input?.debt?.contractAddressUrl) {
    contractAddress = input?.debt?.contractAddressUrl?.match(/0x[a-fA-F0-9]{40}/)?.[0]
  }
  const params = {
    debtId,
    [Keys.GSI1_PK]: StartsWith.DIGITAL_DEBT,
    [Keys.GSI1_SK]: input.debt.debtName,
    companyName: input.companyName,
    blockchain: input.blockchain,
    smartContract: contractAddress,
    smartContractUrl: input?.debt?.contractAddressUrl || '',
    ...input,
    url: CompanyUrls[input.companyName] || input.url,
  }
  const queryParam = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    Item: {
      [Keys.PK]: StartsWith.DIGITAL_DEBT + debtId,
      [Keys.SK]: input.companyName,
      ...params,
    },
  }
  try {
    await put(queryParam)
    return params
  } catch (e) {
    ErrorHandleAndThrow(e, 'Error while creating the create data into digital debt.')
  }
}

export const createDataIntoDigitalBonds = async (
  input: DigitalBondsInf,
): Promise<any> => {
  const bondId = uuid()
  const params = {
    bondId,
    [Keys.GSI1_PK]: StartsWith.DIGITAL_BONDS,
    [Keys.GSI1_SK]: input.assetName,
    companyName: input.companyName,
    bond: { ...input },
    url: CompanyUrls[input.companyName],
  }
  const queryParam = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    Item: {
      [Keys.PK]: StartsWith.DIGITAL_BONDS + bondId,
      [Keys.SK]: input.companyName,
      ...params,
    },
  }
  try {
    await put(queryParam)
    return params
  } catch (e) {
    ErrorHandleAndThrow(e, 'Error while creating the create data into digital bonds..')
  }
}

export const createDigitalArts = async (input: DigitalArtworkInf): Promise<any> => {
  const artId = uuid()
  const companyName = input.companyName
  delete input.companyName
  const params = {
    artId,
    [Keys.GSI1_PK]: StartsWith.DIGITAL_ARTS,
    [Keys.GSI1_SK]: input.artName,
    companyName,
    arts: { ...input },
    url: CompanyUrls[companyName],
  }
  const queryParam = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    Item: {
      [Keys.PK]: StartsWith.DIGITAL_ARTS + artId,
      [Keys.SK]: companyName,
      ...params,
    },
  }
  try {
    await put(queryParam)
    return params
  } catch (e) {
    ErrorHandleAndThrow(e, 'Error while creating the create data into digital bonds..')
  }
}
export const listDigitalBondsDB = async (_q?: Paginated) => {
  const params = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    ScanIndexForward: true,
    IndexName: IndexName.GSI_1,
    KeyConditionExpression: '#766a0 = :766a0',
    ExpressionAttributeValues: {
      ':766a0': StartsWith.DIGITAL_BONDS,
    },
    ExpressionAttributeNames: {
      '#766a0': Keys.GSI1_PK,
    },
  }
  let realEstate: any = null
  if (_q && !_.isEmpty(_q)) {
    const { limit = 10, nextCursor } = _q
    params['Limit'] = limit as number
    realEstate = await paginatedRecords(params, nextCursor, limit)
  } else {
    realEstate = await newQuery(params)
  }
  return realEstate
}

export const listDigitalArts = async (_q?: Paginated) => {
  const params = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    ScanIndexForward: true,
    IndexName: IndexName.GSI_1,
    KeyConditionExpression: '#766a0 = :766a0',
    ExpressionAttributeValues: {
      ':766a0': StartsWith.DIGITAL_ARTS,
    },
    ExpressionAttributeNames: {
      '#766a0': Keys.GSI1_PK,
    },
  }
  let realEstate: any = null
  if (_q && !_.isEmpty(_q)) {
    const { limit = 10, nextCursor } = _q
    params['Limit'] = limit as number
    realEstate = await paginatedRecords(params, nextCursor, limit)
  } else {
    realEstate = await newQuery(params)
  }
  return realEstate
}

export async function createDataIntoDigitalRe(items: any) {
  const client = getDynamoDbClient()
  const perChunk = 25 // items per chunk
  const result = items.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [])

  for (let i = 1; i <= result.length; i++) {
    try {
      await client
        .batchWrite({
          RequestItems: {
            [`${ZILLOW_DIGITAL_RE_DB}`]: result[i - 1],
          },
        })
        .promise()
      logger.info('Inserted Records', perChunk * i)
    } catch (e) {
      logger.info(`Error while batch inserted : ${JSON.stringify(e)}`)
      throw e
    }
  }
}

export async function createExportedDataIntoDigitalRe(items: any) {
  const client = getDynamoDbClient()
  const perChunk = 25 // items per chunk
  const result = items.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    item[Keys.GSI2_PK] = StartsWith.DIGITAL_RE
    item[Keys.GSI2_SK] = item.companyName
    const jsonObj = {}
    for (const key in item) {
      try {
        if (JSON.parse(item[key])) {
          const d = JSON.parse(item[key])
          const unmarshalled = AWS.DynamoDB.Converter.unmarshall(d, {
            convertEmptyValues: true,
          })
          const isEmpty = Object.values(unmarshalled).every(x => x === undefined)
          if (isEmpty) {
            jsonObj[key] = item[key]
          } else {
            jsonObj[key] = unmarshalled
          }
        }
      } catch (e) {
        jsonObj[key] = item[key]
      }
    }
    resultArray[chunkIndex].push({
      PutRequest: {
        Item: jsonObj,
      },
    })
    return resultArray
  }, [])

  for (let i = 1; i <= result.length; i++) {
    try {
      await client
        .batchWrite({
          RequestItems: {
            [`${ZILLOW_DIGITAL_RE_DB}`]: result[i - 1],
          },
        })
        .promise()
    } catch (e) {
      logger.info(`Error while batch inserted : ${JSON.stringify(e)}`)
      throw e
    }
  }
}

export const updateExistingDigitalREDb = async (data: any, keys: any) => {
  const returnType = await generateUpdateQuery({
    updates: data,
  })
  const updateRes = await update({
    TableName: ZILLOW_DIGITAL_RE_DB,
    Key: keys,
    ...returnType,
  })
  return updateRes
}

export const listDigitalDebt = async (_q?: Paginated) => {
  const params = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    ScanIndexForward: true,
    IndexName: IndexName.GSI_1,
    KeyConditionExpression: '#766a0 = :766a0',
    ExpressionAttributeValues: {
      ':766a0': StartsWith.DIGITAL_DEBT,
    },
    ExpressionAttributeNames: {
      '#766a0': Keys.GSI1_PK,
    },
  }
  let realEstate: any = null
  if (_q && !_.isEmpty(_q)) {
    const { limit = 10, nextCursor } = _q
    params['Limit'] = limit as number
    realEstate = await paginatedRecords(params, nextCursor, limit)
  } else {
    realEstate = await newQuery(params)
  }
  return realEstate
}

export const listDigitalReDB = async (_q?: Paginated) => {
  const params = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    ScanIndexForward: true,
    IndexName: IndexName.GSI_1,
    KeyConditionExpression: '#766a0 = :766a0',
    ExpressionAttributeValues: {
      ':766a0': StartsWith.DIGITAL_RE,
    },
    ExpressionAttributeNames: {
      '#766a0': Keys.GSI1_PK,
    },
  }

  let realEstate: any = null
  if (_q && !_.isEmpty(_q)) {
    const { limit = 10, nextCursor } = _q
    params['Limit'] = limit as number
    realEstate = await paginatedRecords(params, nextCursor, limit)
  } else {
    realEstate = await newQuery(params)
  }
  return realEstate
}

export const listDigitalReOnlyPK = async (_q?: Paginated) => {
  const resp = await newQuery({
    TableName: ZILLOW_DIGITAL_RE_DB,
    ScanIndexForward: true,
    IndexName: IndexName.GSI_1,
    KeyConditionExpression: '#766a0 = :766a0',
    ExpressionAttributeValues: {
      ':766a0': StartsWith.DIGITAL_RE,
    },
    ExpressionAttributeNames: {
      '#766a0': Keys.GSI1_PK,
    },
    ProjectionExpression: 'reId',
  })
  return resp
}
export const createReCompanySocialsDB = async (input: any) => {
  const { reCompany, reCompanyUrl, socials, explorers } = input
  const params = {
    companyId: reCompany,
    reCompany,
    reCompanyUrl,
    socials,
    explorers,
  }
  const queryParam = {
    TableName: COMPANY_RE_DB,
    Item: {
      [Keys.PK]: reCompany,
      [Keys.SK]: AccessPatternMatrix().companySocials.sk,
      ...params,
    },
  }
  try {
    await put(queryParam)
    return params
  } catch (e) {
    ErrorHandleAndThrow(e, 'Error while creating the comapny in DB')
  }
}
export const getDigitalReCompanyDB = async (companyName: string) => {
  let resp = null
  try {
    resp = await get({
      TableName: COMPANY_RE_DB,
      Key: {
        [Keys.PK]: companyName,
        [Keys.SK]: AccessPatternMatrix().companySocials.sk,
      },
    })
  } catch (e) {
    ErrorHandleAndThrow(e, 'Error while getting the company Data.')
  }
  return resp
}

export const getDigitalRealEstateDB = async (reId: string, companyName: string) => {
  let resp = null
  try {
    resp = await get({
      TableName: ZILLOW_DIGITAL_RE_DB,
      Key: {
        [Keys.PK]: StartsWith.DIGITAL_RE + reId,
        [Keys.SK]: companyName,
      },
    })
  } catch (e) {
    ErrorHandleAndThrow(e, 'Error while getting the getDigitalRealEstateDB')
  }
  return resp
}

export const getDigitalDebtDB = async (reId: string, companyName: string) => {
  let resp = null
  try {
    resp = await get({
      TableName: ZILLOW_DIGITAL_RE_DB,
      Key: {
        [Keys.PK]: StartsWith.DIGITAL_DEBT + reId,
        [Keys.SK]: companyName,
      },
    })
  } catch (e) {
    ErrorHandleAndThrow(e, 'Error while getting the getDigitalDebtDB')
  }
  return resp
}

export const updateMarketCapitalisationDB = async (num1: any) => {
  const num = await generateUpdateQuery({ updates: num1 })
  await update({
    Key: {
      [Keys.PK]: '#CAP',
      [Keys.SK]: '#MC',
    },
    TableName: ZILLOW_DIGITAL_RE_DB,
    ...num,
  })
  logger.info('update market capitalisation in DB done !!!')
}

export const getMarketCapitalisationDB = async () => {
  const rep = await get({
    Key: {
      [Keys.PK]: '#CAP',
      [Keys.SK]: '#MC',
    },
    TableName: ZILLOW_DIGITAL_RE_DB,
  })
  return rep
}

export const queryDigitalReByCompanyName = async (companyName: PlatformName) => {
  const params = {
    TableName: ZILLOW_DIGITAL_RE_DB,
    ScanIndexForward: true,
    IndexName: IndexName.GSI_2,
    KeyConditionExpression: '#766a0 = :766a0 And #766a1 = :766a1',
    ExpressionAttributeValues: {
      ':766a0': StartsWith.DIGITAL_RE,
      ':766a1': companyName,
    },
    ExpressionAttributeNames: {
      '#766a0': Keys.GSI2_PK,
      '#766a1': Keys.GSI2_SK,
    },
  }
  return await newQuery(params)
}
