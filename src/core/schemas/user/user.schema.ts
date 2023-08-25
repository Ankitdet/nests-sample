import {
  IRoleDB,
  IUserPermision,
  IUserPermisionResponse,
} from '@core/interfaces/user/user-permission.interface'
import { AttributesOf } from '@utils/index'

// schema interface
export interface UserDBSchema {
  email?: string
  firstname?: string
  lastname?: string
  role?: IRoleDB
  user_id?: string
  re_id?: string
  subscriptionId?: string
  subscriptionAccepted?: boolean
  subscriptionTimestamp?: string
  permission?: IUserPermision
  applicantId?: string
  workflowRunId?: string
  kycStatus?: string
  whitelistAddress?: string
  ppmAgreement?: boolean
  ppmAgreementTimestamp?: string
  operatingAgreement?: boolean
  operatingAgreementTimestamp?: string
  totalNumberOfTokens?: number
  tokenPrice?: number
  tokensInThisOrder?: number
  amount?: number
  referralCode?: string
  referrerCode?: string
  referralLink?: string
  referralBonus?: number
  referrerUserId?: string
  onfidoWorkflowRunId?: string
  onfidoApplicantId?: string
  onfidoWorkflowState?: string
}

export interface UserResponseSchema extends IUserPermisionResponse, IRoleDB {
  email?: string
  firstName?: string
  lastName?: string
  role?: IRoleDB
  user_id?: string
  re_id?: string
  subscriptionId?: string
  subscriptionAccepted?: boolean
  subscriptionTimestamp?: string
  permission?: IUserPermision
  applicantId?: string
  workflowRunId?: string
  whitelistAddress?: string
  ppmAgreement?: boolean
  ppmAgreementTimestamp?: string
  operatingAgreement?: boolean
  operatingAgreementTimestamp?: string
  totalNumberOfTokens?: number
  tokenPrice?: number
  tokensInThisOrder?: number
  amount?: number
  referrerCode?: string
  referralCode?: string
  referralLink?: string
  referralBonus?: number
  referrerUserId?: string
  onfidoWorkflowRunId?: string
  onfidoApplicantId?: string
  onfidoWorkflowState?: string
}

export const userDbSchemaAttr = AttributesOf<UserDBSchema>()
