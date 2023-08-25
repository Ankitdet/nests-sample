import { DB_TABLE_NAME } from '@const/environments'
import { RealEstateUserSchema } from '@core/schemas/real-estate/real-estate-user.schema'
import {
  deleteQuery,
  generateUpdateQuery,
  get,
  getObject,
  IS_CAMEL_CASE,
  put,
  query,
  update,
} from '@utils/index'
import { AccessPatternMatrix, ValueFor } from '../core/dyanamo-access-pattern'
import { IndexName, Keys } from '../core/dynamo-enum'

export class RealEstateUserDB {
  cumulativeObj: RealEstateUserSchema

  get re_id_pk(): string {
    return AccessPatternMatrix().real_estate_users.pk.replace(
      ValueFor.reId,
      this.cumulativeObj.re_id,
    )
  }

  get user_id_sk(): string {
    return AccessPatternMatrix().real_estate_users.sk.replace(
      ValueFor.userId,
      this.cumulativeObj.user_id,
    )
  }

  get user_id_gsi1_pk(): string {
    return AccessPatternMatrix().real_estate_users.gsi1_pk.replace(
      ValueFor.userId,
      this.cumulativeObj.user_id,
    )
  }

  get re_id_gsi1_sk(): string {
    return AccessPatternMatrix().real_estate_users.gsi1_sk.replace(
      ValueFor.reId,
      this.cumulativeObj.re_id,
    )
  }

  get address_gsi2_pk(): string {
    return AccessPatternMatrix()
      .real_estate_info.gsi2_pk.replace('ADD', this.cumulativeObj.add.toUpperCase())
      .replace('STATE', this.cumulativeObj.state.toUpperCase())
      .replace('CITY', this.cumulativeObj.city.toUpperCase())
      .replace('ZIP', String(this.cumulativeObj.zip).toUpperCase())
      .toUpperCase()
  }

  constructor(cumulativeObject?: RealEstateUserSchema) {
    this.cumulativeObj = cumulativeObject
  }

  toItem(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.re_id_pk,
      [Keys.SK]: this.user_id_sk,
      [Keys.GSI1_PK]: this.user_id_gsi1_pk,
      [Keys.GSI1_SK]: this.re_id_gsi1_sk,
      [Keys.GSI2_PK]: this.address_gsi2_pk,
      ...this.cumulativeObj,
    }
    delete data.add
    delete data.state
    delete data.city
    delete data.zip
    return data
  }

  toGetItem(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.re_id_pk,
      [Keys.SK]: this.user_id_sk,
    }
    return data
  }
}

export const createRealEstateHavingUser = async (prop: RealEstateUserDB) => {
  await put(
    {
      TableName: DB_TABLE_NAME,
      Item: prop.toItem(),
    },
    IS_CAMEL_CASE,
  )
}

export const getRealEstateHavingUser = async (prop: RealEstateUserSchema) => {
  const obj = getObject(RealEstateUserDB, prop)
  return await get(
    {
      TableName: DB_TABLE_NAME,
      Key: obj.toGetItem(),
    },
    IS_CAMEL_CASE,
  )
}

export const deleteTokenTransferred = async (prop: RealEstateUserSchema) => {
  const obj = getObject(RealEstateUserDB, prop)
  return await deleteQuery({
    TableName: DB_TABLE_NAME,
    Key: obj.toGetItem(),
  })
}

export const updateRealEstateHavingUser = async (prop: RealEstateUserSchema) => {
  const obj = getObject(RealEstateUserDB, prop)
  const inputs = {
    ...obj.cumulativeObj,
  }
  const returnType = await generateUpdateQuery(
    {
      updates: inputs,
    },
    IS_CAMEL_CASE,
  )

  const updateRes = await update(
    {
      TableName: DB_TABLE_NAME,
      Key: {
        [Keys.PK]: obj.re_id_pk,
        [Keys.SK]: obj.user_id_sk,
      },
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
  return updateRes
}

export const getOrderTransactionByUserId = (
  prop: RealEstateUserSchema,
): Promise<RealEstateUserSchema> => {
  const obj = getObject(RealEstateUserDB, prop)
  return query(
    {
      TableName: DB_TABLE_NAME,
      ScanIndexForward: true,
      IndexName: IndexName.GSI_1,
      KeyConditionExpression: '#766a0 = :766a0',
      ExpressionAttributeValues: {
        ':766a0': obj.user_id_gsi1_pk,
      },
      ExpressionAttributeNames: {
        '#766a0': Keys.SK,
      },
    },
    IS_CAMEL_CASE,
  )
}
