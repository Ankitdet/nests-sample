import { PaymentType } from '@core/enums'
import { logger } from '@shared/logger/logger'
import { CommonSchema } from '../../common.schema'

export interface OrderSchema extends CommonSchema {
  re_id?: string
  user_id?: string
  orderTotalUsd?: number
  tokensInThisOrder?: number
  orderId?: string
  paymentType?: PaymentType
  paymentStatus?: string
  orderCurrency?: string
  metadata?: any
  isProccessed?: boolean
  operatingDocTimestamp?: string
  subscriptionDocTimestamp?: string
}

type K1 = keyof OrderSchema

const a: K1 = 'orderId'
logger.info(a)
