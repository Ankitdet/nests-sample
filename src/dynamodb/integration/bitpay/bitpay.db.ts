import { DB_TABLE_NAME } from '@const/environments'
import { AccessPatternMatrix, ValueFor } from '@db/core/dyanamo-access-pattern'
import { generateUpdateQuery, IS_CAMEL_CASE, update } from '@utils/index'
import { Keys } from '../../core/dynamo-enum'

interface BitPaySchema {
  re_id?: string
  user_id?: string
  number_of_tokens?: number
  total_sum?: number
  token_price?: number
  order_id?: string
  payment_type?: string
  status?: string
}

export class BitPayDB {
  bitPayObj: BitPaySchema

  constructor(bitpay: BitPaySchema) {
    this.bitPayObj = bitpay
  }

  get order_pk() {
    return AccessPatternMatrix().real_estate_order.pk.replace(
      ValueFor.reId,
      this.bitPayObj.re_id,
    )
  }

  get order_sk() {
    return AccessPatternMatrix().real_estate_order.sk.replace(
      ValueFor.order_id,
      this.bitPayObj.order_id,
    )
  }

  get order_gsi1_pk() {
    return AccessPatternMatrix().real_estate_order.gsi1_pk.replace(
      ValueFor.userId,
      this.bitPayObj.user_id,
    )
  }

  get order_gsi1_sk() {
    return AccessPatternMatrix().real_estate_order.gsi1_sk.replace(
      ValueFor.reId,
      this.bitPayObj.re_id,
    )
  }

  get order_gsi2_pk() {
    return AccessPatternMatrix().real_estate_order.gsi2_pk.replace(
      ValueFor.order_id,
      this.bitPayObj.order_id,
    )
  }

  toCreateItems(): Record<string, unknown> {
    const items = {
      [Keys.PK]: this.order_pk,
      [Keys.SK]: this.order_sk,
      [Keys.GSI1_PK]: this.order_gsi1_pk,
      [Keys.GSI1_SK]: this.order_gsi1_sk,
      [Keys.GSI2_PK]: this.order_gsi2_pk,
    }
    return items
  }
}

export const savePayment = async (payment: BitPayDB) => {
  const input = {
    ...payment.bitPayObj,
  }
  const returnType = await generateUpdateQuery({ updates: input })
  return await update(
    {
      TableName: DB_TABLE_NAME,
      Key: payment.toCreateItems(),
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
}
