import { DB_TABLE_NAME } from '@const/environments'
import { CumulativeSchema } from '@core/schemas'
import { AccessPatternMatrix } from '@db/core/dyanamo-access-pattern'
import { logger } from '@shared/logger/logger'
import {
  generateUpdateQuery,
  get,
  getObject,
  IS_CAMEL_CASE,
  put,
  update,
} from '@utils/index'
import { Keys } from '../core/dynamo-enum'

export class CumulativeDB {
  cumulativeObj: CumulativeSchema

  get re_id_pk(): string {
    return AccessPatternMatrix().cumulative.pk
  }

  get user_id_sk(): string {
    return AccessPatternMatrix().cumulative.sk
  }

  constructor(cumulativeObject?: CumulativeSchema) {
    this.cumulativeObj = cumulativeObject
  }

  toItemCreateCumulatives(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.re_id_pk,
      [Keys.SK]: this.user_id_sk,
      ...this.cumulativeObj,
    }
    return data
  }

  toItem(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.re_id_pk,
      [Keys.SK]: this.user_id_sk,
    }
    return data
  }
}

export const createCumulatives = async (clv: CumulativeDB): Promise<void> => {
  await put(
    {
      TableName: DB_TABLE_NAME,
      Item: clv.toItemCreateCumulatives(),
    },
    IS_CAMEL_CASE,
  )
}

export const getCumulatives = async (
  clv?: CumulativeSchema,
): Promise<CumulativeSchema> => {
  const obj = getObject(CumulativeDB, clv)
  const data = await get(
    {
      TableName: DB_TABLE_NAME,
      Key: obj.toItem(),
    },
    IS_CAMEL_CASE,
  )
  return data as CumulativeSchema
}

export const updateCumulatives = async (clv: CumulativeSchema): Promise<void> => {
  const obj = getObject(CumulativeDB, clv)
  const input = {
    ...obj.cumulativeObj,
  }
  const returnType = await generateUpdateQuery({ updates: input }, IS_CAMEL_CASE)

  await update(
    {
      TableName: DB_TABLE_NAME,
      Key: obj.toItem(),
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
  logger.info('update Cumulative query')
}
