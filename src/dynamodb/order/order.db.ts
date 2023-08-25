import { DB_TABLE_NAME } from '@const/environments'
import { OrderSchema } from '@core/schemas/integrations/order/order.schema'
import { AccessPatternMatrix, ValueFor } from '@db/core/dyanamo-access-pattern'
import {
  deleteQuery,
  generateUpdateQuery,
  getObject,
  IS_CAMEL_CASE,
  put,
  query,
  scan,
  update,
} from '@utils/index'
import { IndexName, Keys } from '../core/dynamo-enum'

export class OrderDB {
  orderDB: OrderSchema
  constructor(order: OrderSchema) {
    this.orderDB = order
  }

  get order_create_pk(): string {
    return AccessPatternMatrix().real_estate_order.pk.replace(
      ValueFor.reId,
      this.orderDB.re_id,
    )
  }

  get order_create_sk(): string {
    return AccessPatternMatrix().real_estate_order.sk.replace(
      ValueFor.order_id,
      this.orderDB.orderId,
    )
  }

  get order_create_gsi1_pk(): string {
    return AccessPatternMatrix().real_estate_order.gsi1_sk.replace(
      ValueFor.reId,
      this.orderDB.re_id,
    )
  }

  get order_create_gsi1_sk(): string {
    return AccessPatternMatrix().real_estate_order.gsi1_pk.replace(
      ValueFor.userId,
      this.orderDB.user_id,
    )
  }

  get order_create_gsi2_pk(): string {
    return AccessPatternMatrix().real_estate_order.gsi2_pk.replace(
      ValueFor.order_id,
      this.orderDB.orderId,
    )
  }

  toCreateOrder(): Record<string, unknown> {
    const items = {
      [Keys.PK]: this.order_create_pk,
      [Keys.SK]: this.order_create_sk,
      [Keys.GSI1_PK]: this.order_create_gsi1_pk,
      [Keys.GSI1_SK]: this.order_create_gsi1_sk,
      [Keys.GSI2_PK]: this.order_create_gsi2_pk,
      ...this.orderDB,
    }
    return items
  }

  toUpdateOrder(): Record<string, unknown> {
    const items = {
      [Keys.PK]: this.order_create_pk,
      [Keys.SK]: this.order_create_sk,
    }
    return items
  }
}

export const saveOrder = async (order: OrderSchema): Promise<any> => {
  const obj = getObject(OrderDB, order)
  return await put(
    {
      TableName: DB_TABLE_NAME,
      Item: obj.toCreateOrder(),
    },
    IS_CAMEL_CASE,
  )
}

export const updateOrder = async (orderSchema: OrderSchema): Promise<OrderSchema> => {
  const obj = getObject(OrderDB, orderSchema)
  const res: any = await getExistiongOrder(orderSchema)
  const inputs = {
    ...obj.orderDB,
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
        [Keys.PK]: res[0]?.pk,
        [Keys.SK]: res[0]?.sk,
      },
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
  return updateRes
}

export const getExistiongOrder = async (order: OrderSchema): Promise<[OrderSchema]> => {
  const obj = getObject(OrderDB, order)
  return await query(
    {
      TableName: DB_TABLE_NAME,
      ScanIndexForward: true,
      IndexName: IndexName.GSI_2,
      KeyConditionExpression: '#eba60 = :eba60',
      ExpressionAttributeValues: {
        ':eba60': obj.order_create_gsi2_pk,
      },
      ExpressionAttributeNames: {
        '#eba60': Keys.GSI2_PK,
      },
    },
    IS_CAMEL_CASE,
  )
}

export const deleteOrder = async (order: OrderSchema) => {
  const obj = getObject(OrderDB, order)
  return await deleteQuery({
    TableName: DB_TABLE_NAME,
    Key: {
      [Keys.PK]: obj.order_create_pk,
      [Keys.SK]: obj.order_create_sk,
    },
  })
}

export const ascByUpdatedAt = (orders: [OrderSchema]): [OrderSchema] => {
  orders.sort((c, d) => {
    return new Date(c.updated_at).valueOf() - new Date(d.updated_at).valueOf()
  })
  return orders
}

export const updateOrderProcessStatus = async (
  orderSchema: OrderSchema,
): Promise<OrderSchema> => {
  const obj = getObject(OrderDB, orderSchema)
  const returnType = await generateUpdateQuery(
    {
      updates: obj.orderDB,
    },
    IS_CAMEL_CASE,
  )
  const updateRes = await update(
    {
      TableName: DB_TABLE_NAME,
      Key: obj.toUpdateOrder(),
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
  return updateRes
}

export const getOrderDetailsByStripeId = async (
  orderSchema: OrderSchema,
): Promise<OrderSchema> => {
  const obj = getObject(OrderDB, orderSchema)
  const updateRes = await scan(
    {
      TableName: DB_TABLE_NAME,
      ConsistentRead: false,
      FilterExpression: '#order.#31b40 = :31b40',
      ExpressionAttributeValues: {
        ':31b40': obj.orderDB.metadata.id,
      },
      ExpressionAttributeNames: {
        '#order': 'metadata',
        '#31b40': 'id',
      },
    },
    IS_CAMEL_CASE,
  )
  return updateRes[0]
}
