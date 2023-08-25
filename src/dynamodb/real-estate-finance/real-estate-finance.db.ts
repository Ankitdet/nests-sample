import { DB_TABLE_NAME } from '@const/environments'
import { RealEstateInterface } from '@core/interfaces'
import { RealEstateFinanceSchema } from '@core/schemas'
import {
  AccessPatternMatrix,
  StartsWith,
  ValueFor,
} from '@db/core/dyanamo-access-pattern'
import { logger } from '@shared/logger/logger'
import { generateUpdateQuery, IS_CAMEL_CASE, query, update } from '@utils/index'

export class RealEstateFinance {
  refinanceObj?: RealEstateFinanceSchema

  constructor(reFinance: RealEstateFinanceSchema) {
    this.refinanceObj = reFinance
  }

  get re_id_pk(): string {
    return AccessPatternMatrix().real_estate_info.pk.replace(
      ValueFor.reId,
      this.refinanceObj.re_id,
    )
  }
  get prop_sk(): string {
    return AccessPatternMatrix().real_estate_info.sk
  }
}

export const createRealEstateFinanceData = async (
  realEstateFinance: RealEstateFinance,
): Promise<RealEstateInterface> => {
  const updateQuertData = await generateUpdateQuery(
    {
      updates: realEstateFinance.refinanceObj,
    },
    IS_CAMEL_CASE,
  )
  try {
    const updatedAllNew = await update(
      {
        TableName: DB_TABLE_NAME,
        Key: {
          pk: realEstateFinance.re_id_pk,
          sk: realEstateFinance.prop_sk,
        },
        ...updateQuertData,
      },
      IS_CAMEL_CASE,
    )
    logger.info(`Response after query executed: ${JSON.stringify(updatedAllNew)}`)
    const data = updatedAllNew
    return data as RealEstateInterface
  } catch (error) {
    logger.error(error)
    throw error
  }
}

// re_id and Begins with
export const getRealEstateByReIdAndBeginsWith = async (
  realEstateFinance: RealEstateFinance,
) => {
  const findData = await query(
    {
      TableName: DB_TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `${StartsWith.RE}#${realEstateFinance.refinanceObj.re_id}`,
        ':sk': `${StartsWith.USER}`,
      },
    },
    IS_CAMEL_CASE,
  )
  return findData
}
