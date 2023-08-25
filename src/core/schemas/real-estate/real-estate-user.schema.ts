import { CommonSchema } from '../common.schema'

export interface RealEstateUserSchema extends CommonSchema {
  re_id?: string
  user_id?: string
  add?: string
  city?: string
  state?: string
  zip?: string
  totalTokensOwnedByBuyer?: number
  tokenTransferredWallet?: number
  failedTokensTransferred?: number
}
