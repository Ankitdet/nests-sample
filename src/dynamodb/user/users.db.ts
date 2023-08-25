import { USER_DB_TABLE_NAME } from '@const/environments'
import { getKycStatus, OnfidoKycStatus } from '@core/enums'
import { UserDBSchema, userDbSchemaAttr, UserResponseSchema } from '@core/schemas'
import { logger } from '@shared/logger/logger'
import {
  generateUpdateQuery,
  get,
  getObject,
  IS_CAMEL_CASE,
  put,
  query,
  scan,
  // skipNullAttributes,
  update,
} from '@utils/index'
import { AccessPatternMatrix, ValueFor } from '../core/dyanamo-access-pattern'
import { IndexName, Keys } from '../core/dynamo-enum'
import { getUserInfoById } from '../integration/blockchain/blockchain.db'
export class UserDB {
  userDb: UserDBSchema

  constructor(userDb: UserDBSchema) {
    this.userDb = userDb
  }

  get user_id_pk() {
    return AccessPatternMatrix().user.pk.replace(ValueFor.userId, this.userDb.user_id)
  }

  get user_id_sk() {
    return AccessPatternMatrix().user.sk.replace(ValueFor.userId, this.userDb.user_id)
  }

  get re_id_sk() {
    return AccessPatternMatrix().user_ppm_operating_agreement.sk.replace(
      ValueFor.reId,
      this.userDb.re_id,
    )
  }
  get code_gsi1pk() {
    return AccessPatternMatrix().user.gsi1_pk.replace(
      ValueFor.code,
      this.userDb.referralCode,
    )
  }
  get code_gsi1sk() {
    return AccessPatternMatrix().user.gsi1_sk.replace(
      ValueFor.code,
      this.userDb.referralCode,
    )
  }

  get code_gsi2pk() {
    return AccessPatternMatrix().user.gsi2_pk.replace(
      ValueFor.code,
      this.userDb.referralCode,
    )
  }

  get code_gsi2sk() {
    return AccessPatternMatrix().user.gsi2_sk.replace(
      ValueFor.code,
      this.userDb.referralCode,
    )
  }

  get applicant_id_sk() {
    return AccessPatternMatrix().user_applicants.sk.replace(
      ValueFor.applicantId,
      this.userDb.applicantId,
    )
  }

  get workflow_run_id_gsi1_pk() {
    return AccessPatternMatrix().user_applicants.gsi1_pk.replace(
      ValueFor.wf_run_id,
      this.userDb.workflowRunId,
    )
  }

  get user_subscription_agreement_pk() {
    return AccessPatternMatrix().user_subscription_agreement.pk.replace(
      ValueFor.userId,
      this.userDb.user_id,
    )
  }

  get user_subscription_agreement_sk() {
    return AccessPatternMatrix().user_subscription_agreement.sk.replace(
      ValueFor.subId,
      this.userDb.subscriptionId,
    )
  }

  get user_subscription_agreement_gsi1_pk() {
    return AccessPatternMatrix().user_subscription_agreement.gsi1_pk.replace(
      ValueFor.reId,
      this.userDb.re_id,
    )
  }

  get user_subscription_agreement_gsi1_sk() {
    return AccessPatternMatrix().user_subscription_agreement.gsi1_sk.replace(
      ValueFor.userId,
      this.userDb.user_id,
    )
  }

  toUpdateSubscriptionDocumentAgreement(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.user_subscription_agreement_pk,
      [Keys.SK]: this.user_subscription_agreement_sk,
      [Keys.GSI1_PK]: this.user_subscription_agreement_gsi1_pk,
      [Keys.GSI1_SK]: this.user_subscription_agreement_gsi1_sk,
      ...this.userDb,
    }
    return data
  }
  toCreateItems(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.user_id_pk,
      [Keys.SK]: this.user_id_sk,
      ...this.userDb,
    }
    return data
  }

  toCreateApplicantAndWorkFlowRunId(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.user_id_pk,
      [Keys.SK]: this.user_id_sk,
    }
    return data
  }

  toGetItems(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.user_id_pk,
      [Keys.SK]: this.user_id_sk,
    }
    return data
  }

  toPutItem(): Record<string, unknown> {
    const data = {
      [Keys.PK]: this.user_id_pk,
      [Keys.SK]: this.user_id_sk,
      ...this.userDb,
    }
    return data
  }
  toGsi1Items(): Record<string, unknown> {
    const data = {
      [Keys.GSI1_PK]: this.code_gsi1pk,
      [Keys.GSI1_SK]: this.code_gsi1sk,
    }
    return data
  }
  toGsi2Items(): Record<string, unknown> {
    const data = {
      [Keys.GSI2_PK]: this.code_gsi2pk,
      [Keys.GSI2_SK]: this.code_gsi2sk,
    }
    return data
  }
}

export const getCognitoUserDetail = async (user: UserDBSchema): Promise<any> => {
  const userObj = getObject(UserDB, user)
  return get(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: userObj.toGetItems(),
    },
    IS_CAMEL_CASE,
  )
}

export const getUserByEmailId = async (user: UserDBSchema): Promise<any> => {
  const userObj = getObject(UserDB, user)
  return scan(
    {
      TableName: USER_DB_TABLE_NAME,
      ConsistentRead: false,
      FilterExpression: '#a88b0 = :a88b0',
      ExpressionAttributeValues: {
        ':a88b0': userObj.userDb.email,
      },
      ExpressionAttributeNames: {
        '#a88b0': 'email',
      },
    },
    IS_CAMEL_CASE,
  )
}
export const updateCognitoUser = async (userDb: UserDBSchema): Promise<any> => {
  const user = getObject(UserDB, userDb)
  /*   let gsi = {}
    if (user?.userDb?.referralCode) {
      gsi = { ...user.toGsiPkItem() }
    }
     if (user?.userDb?.referrerUserId) {
      gsi = { ...gsi, ...user.toGsiSkItem() }
    } */
  const input: any = {
    /* referralCode: user?.userDb?.referralCode,
    referrerCode: user?.userDb?.referrerCode,
    referrerUserId: user?.userDb?.referrerUserId || '',
    referralBonus: user?.userDb?.referralBonus,
    referralLink: user?.userDb?.referralLink, */
    email: user?.userDb?.email,
    user_id: user.userDb?.user_id,
    ...user.userDb.role,
    ...user.userDb.permission,
    // ...gsi,
  }

  // SKIP Null atttributes
  /* input = skipNullAttributes(input) */
  const returnType = await generateUpdateQuery({ updates: input }, IS_CAMEL_CASE)
  return await update(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: {
        pk: user.user_id_pk,
        sk: user.user_id_sk,
      },
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
}

export const reffralMapper = (user: UserDB): any => {
  let gsi1 = {}
  let gsi2 = {}
  if (user?.userDb?.referralCode) {
    gsi1 = { ...user.toGsi1Items() }
  }
  if (user?.userDb?.referrerUserId) {
    gsi2 = { ...user.toGsi2Items() }
  }
  return {
    referralCode: user?.userDb?.referralCode,
    referrerCode: user?.userDb?.referrerCode,
    referrerUserId: user?.userDb?.referrerUserId,
    referralBonus: user?.userDb?.referralBonus,
    referralLink: user?.userDb?.referralLink,
    ...gsi1,
    ...gsi2,
  }
}
export const updateCognitoUserProps = async (
  userDb: UserResponseSchema,
): Promise<any> => {
  const input = {
    ...userDb,
  }
  const user = getObject(UserDB, userDb)
  const pk = input[Keys.PK]
  const sk = input[Keys.SK]
  let keys: any = {
    [Keys.PK]: pk,
    [Keys.SK]: sk,
  }
  if (!pk || !sk) {
    keys = user.toGetItems()
  }
  delete input[Keys.PK]
  delete input[Keys.SK]
  const returnType = await generateUpdateQuery({ updates: input }, IS_CAMEL_CASE)
  return await update(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: keys,
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
}

export const updateWorkflowRunId = async (onfido: UserDB): Promise<any> => {
  logger.info('Update Workflow Run Id calling.')
  const returnType = await generateUpdateQuery(
    {
      updates: {
        [userDbSchemaAttr.onfidoWorkflowRunId]: onfido.userDb.workflowRunId,
        [userDbSchemaAttr.onfidoApplicantId]: onfido.userDb.applicantId,
      },
    },
    IS_CAMEL_CASE,
  )
  const updateRes = await update(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: onfido.toCreateApplicantAndWorkFlowRunId(),
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
  return updateRes
}

export const updateOnfidoKYCStatusInDB = async (
  workflow_run_id: string,
  state: string,
): Promise<any> => {
  const data = await scan(
    {
      TableName: USER_DB_TABLE_NAME,
      ConsistentRead: false,
      FilterExpression: '#a88b0 = :a88b0',
      ExpressionAttributeValues: {
        ':a88b0': workflow_run_id,
      },
      ExpressionAttributeNames: {
        '#a88b0': 'onfido_workflow_run_id',
      },
    },
    IS_CAMEL_CASE,
  )
  let kyc_status = false
  if (state === getKycStatus(OnfidoKycStatus.approved)) {
    kyc_status = true
  }
  const returnType = await generateUpdateQuery(
    {
      updates: {
        [userDbSchemaAttr.kycStatus]: kyc_status,
        [userDbSchemaAttr.onfidoWorkflowState]: state,
      },
    },
    IS_CAMEL_CASE,
  )
  logger.info(
    `Getting the user data by workflow run id ${JSON.stringify(data, null, 4)}`,
  )
  logger.info(`Update data into User Table ${JSON.stringify(returnType, null, 4)}`)
  const userDb = new UserDB({
    user_id: data[0]?.user_id,
  })
  const updateRes = await update(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: userDb.toGetItems(),
      ...returnType,
    },
    IS_CAMEL_CASE,
  )
  logger.info(updateRes)
  return {
    user_id: data[0]?.user_id,
    email: data[0]?.email,
    kyc_status,
  }
}

export const createWhiteListInDB = async (input: UserDBSchema): Promise<any> => {
  const obj = getObject(UserDB, input)
  const returnType = await generateUpdateQuery({ updates: obj.userDb }, IS_CAMEL_CASE)
  try {
    return await update(
      {
        TableName: USER_DB_TABLE_NAME,
        Key: {
          pk: obj.user_id_pk,
          sk: obj.user_id_sk,
        },
        ...returnType,
      },
      IS_CAMEL_CASE,
    )
  } catch (e) {
    return 'Etherium address is already exist.'
  }
}

export const checkUserInCognitoDB = async (
  userSchema: UserDBSchema,
): Promise<UserDBSchema> => {
  const obj = getObject(UserDB, userSchema)
  return await get(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: {
        pk: obj.user_id_pk,
        sk: obj.user_id_sk,
      },
    },
    IS_CAMEL_CASE,
  )
}

export const getUserInfoByUserId = async (
  userSchema: UserResponseSchema,
): Promise<UserResponseSchema> => {
  const userData: UserResponseSchema = await getUserInfoById(userSchema.user_id)
  return userData
}

export const getDocAgreementDB = async (
  userSchema: UserDBSchema,
): Promise<UserDBSchema> => {
  const obj = getObject(UserDB, userSchema)
  return await get(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: {
        pk: obj.user_id_pk,
        sk: obj.re_id_sk,
      },
    },
    IS_CAMEL_CASE,
  )
}

export const updateDocAgreementDB = async (
  userSchema: UserDBSchema,
): Promise<UserDBSchema> => {
  const obj = getObject(UserDB, userSchema)
  const returnType = await generateUpdateQuery({ updates: obj.userDb })
  try {
    return await update(
      {
        TableName: USER_DB_TABLE_NAME,
        Key: {
          pk: obj.user_id_pk,
          sk: obj.re_id_sk,
        },
        ...returnType,
      },
      IS_CAMEL_CASE,
    )
  } catch (e) {
    logger.error(JSON.stringify(e))
    throw e
  }
}

export const createSubscriptionAgreementDB = async (
  userSchema: UserDBSchema,
): Promise<any> => {
  const obj = getObject(UserDB, userSchema)
  try {
    await put(
      {
        TableName: USER_DB_TABLE_NAME,
        Item: obj.toUpdateSubscriptionDocumentAgreement(),
      },
      IS_CAMEL_CASE,
    )
  } catch (e) {
    logger.error(JSON.stringify(e))
    throw e
  }
}

export const getSubscriptionAgreementDB = async (
  userSchema: UserDBSchema,
): Promise<[UserDBSchema]> => {
  const obj = getObject(UserDB, userSchema)
  try {
    return await query(
      {
        TableName: USER_DB_TABLE_NAME,
        ScanIndexForward: true,
        IndexName: IndexName.GSI_1,
        KeyConditionExpression: '#44370 = :44370 And #44371 = :44371',
        ExpressionAttributeValues: {
          ':44370': obj.user_subscription_agreement_gsi1_pk,
          ':44371': obj.user_subscription_agreement_gsi1_sk,
        },
        ExpressionAttributeNames: {
          '#44370': Keys.GSI1_PK,
          '#44371': Keys.GSI1_SK,
        },
      },
      IS_CAMEL_CASE,
    )
  } catch (e) {
    logger.error(JSON.stringify(e))
    throw e
  }
}

export const getUserRefral = async (
  userSchema: UserResponseSchema,
): Promise<UserResponseSchema> => {
  const obj = getObject(UserDB, userSchema)
  return await get(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: {
        pk: obj.user_id_pk,
        sk: obj.user_id_sk,
      },
    },
    IS_CAMEL_CASE,
  )
}

export const getUserByReffrarCode = async (
  userSchema: UserResponseSchema,
): Promise<[UserResponseSchema]> => {
  const obj = getObject(UserDB, userSchema)
  const res = await query(
    {
      TableName: USER_DB_TABLE_NAME,
      ScanIndexForward: true,
      IndexName: IndexName.GSI_1,
      KeyConditionExpression: '#44370 = :44370',
      ExpressionAttributeValues: {
        ':44370': obj.code_gsi1pk,
      },
      ExpressionAttributeNames: {
        '#44370': Keys.GSI1_PK,
      },
    },
    IS_CAMEL_CASE,
  )
  return res
}

export const applyBonusAmountDB = async (user: UserResponseSchema) => {
  const obj = getObject(UserDB, user)
  return await update({
    TableName: USER_DB_TABLE_NAME,
    Key: { pk: obj.user_id_pk, sk: obj.user_id_sk },
    UpdateExpression:
      'SET referral_bonus = if_not_exists(referral_bonus, :start) + :inc',
    ExpressionAttributeValues: {
      ':inc': Number(user?.referralBonus),
      ':start': 0,
    },
    ReturnValues: 'UPDATED_NEW',
  })
}
