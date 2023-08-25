import { RECAPTCHA_SECRET } from '@const/environments'
import { Role } from '@core/enums/role.enum'
import {
  CreateWhiteListAddressInput,
  UpdateCognitoUserInput,
} from '@core/inputs/user/user.input'
import { ChangeRoleInf } from '@core/interfaces/user/cahnge-role.interface'
import {
  ICreateCognitoUser,
  IGetCognitoUser,
  IUpdateCognitoUser,
} from '@core/interfaces/user/create-cognito-user.interface'
import { ICreateWhiteList } from '@core/interfaces/user/create-whitelist.interface'
import { IJwtToken } from '@core/interfaces/user/jwt.interface'
import {
  IUserPermision,
  IUserRolePermission,
} from '@core/interfaces/user/user-permission.interface'
import { UserDBSchema, UserResponseSchema } from '@core/schemas'
import { Keys } from '@db/core/dynamo-enum'
import { getOrderTransactionByUserId } from '@db/real-estate/real-estate-user.db'
import {
  applyBonusAmountDB,
  checkUserInCognitoDB,
  createSubscriptionAgreementDB,
  createWhiteListInDB,
  getCognitoUserDetail,
  getDocAgreementDB,
  getSubscriptionAgreementDB,
  getUserByEmailId,
  getUserByReffrarCode,
  getUserInfoByUserId,
  getUserRefral,
  updateCognitoUser,
  updateCognitoUserProps,
  updateDocAgreementDB,
} from '@db/user/users.db'
import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ErrorMsg, SuccessMsg } from '@resources/message'
import { BaseHttpService } from '@shared/base.http.service'
import { BaseError } from '@shared/errors'
import {
  AgreementDocTimestamp,
  convertObjectToSnakeCase,
  generateReferralCode,
  getDateDiffInMonths,
  getIdFromString,
  processEmptyListOrObject,
} from '@utils/common.utils'
import { getCognitoUserAccessToken, refreshToken } from '@utils/user/cognito.util'
import { getPermissionOf, setRoleForDB } from '@utils/user/permission-matrix.util'
import { getRole } from '@utils/user/user-role.utils'
import { Request } from 'express'
import _ from 'lodash'
import moment from 'moment'
import { uuid } from 'uuidv4'
import { logger } from '../../shared/logger/logger'
import { ChainalysisService } from '../chainalysis/chainalysis.service'
import { BlockchainResolver } from '../integration/blockchain/blockchain.resolver'
@Injectable()
export class UserService extends BaseHttpService {
  constructor(
    private readonly alchemyResolver: BlockchainResolver,
    protected httpService: HttpService,
    private readonly chainalysisService: ChainalysisService,
  ) {
    super(httpService)
  }
  async verifyCaptch(request: Request): Promise<boolean> {
    const { token } = request.body
    // sends secret key and response token to google
    return this.httpPost(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
    ).then(e => {
      // check response status and send back to the client-side
      if (e.success) {
        logger.info('success')
        return true
      } else {
        logger.info('Not success 🤖')
        return false
      }
    })
  }
  async createCognitoUser(
    userData: UserDBSchema,
    user_id: string,
  ): Promise<ICreateCognitoUser> {
    const { permission, role } = this.getRolePermission()
    // set Role
    const newRole = setRoleForDB(role[0])
    // save data in dynamodb
    await updateCognitoUser({ ...userData, permission, role: newRole, user_id })
    // return created user data
    return {
      user_id,
      user: {
        email: userData.email,
      },
      rolePermission: {
        permission,
        role,
      },
    }
  }

  public async getReferrerDetailsFromEvent(event: any, user_id?: string) {
    const clientMetadata = event?.request?.clientMetadata
    logger.info(`ClientMetaData: ${JSON.stringify(clientMetadata)}`)

    const referrerCode = clientMetadata?.code
    const link = (clientMetadata?.baseUrl || 'http://dev.3blocks.io/signup') + '?code='
    // Code
    const code = await generateReferralCode()
    logger.info(`ClientMetaData: ${JSON.stringify(clientMetadata)}`)
    // check user Id
    if (!user_id) throw new Error('[getReferrerDetailsFromEvent]: user id not found.')
    let newId = ''
    if (referrerCode) {
      const { referrerUserId } = await this.getReferrerInfo(referrerCode, user_id)
      logger.info(
        `[GetReferrerDetailsFromEvent] ReferrerUserId : ${JSON.stringify(
          referrerUserId,
        )}`,
      )
      newId = referrerUserId
    }
    return {
      referralCode: code,
      referralLink: link,
      referrerCode,
      referrerUserId: newId,
      referralBonus: 0,
    }
  }

  async getCognitoUserDetail(user_id: string): Promise<IGetCognitoUser> {
    const resp = await getCognitoUserDetail({ user_id })
    processEmptyListOrObject(resp)
    const mappedData = await this.mappedData(resp)
    return mappedData
  }
  async getUserByEmailId(emaidId: string): Promise<IGetCognitoUser[]> {
    const resp = await getUserByEmailId({ email: emaidId })
    return resp
  }

  async updateCognitoUser(user: UpdateCognitoUserInput): Promise<IUpdateCognitoUser> {
    // const roleForDb = setRoleForDB(Role.Visitor)
    const { permission, role } = this.getRolePermission(user)
    const existingUser = await this.getCognitoUserDetail(user.user_id)
    const resp = await updateCognitoUser({
      email: existingUser.user.email,
      permission,
      role: {
        [role[0] as Role]: true,
      },
      user_id: user.user_id,
    })
    const mappedData = await this.updateMappedData(resp)
    return mappedData
  }

  async getAccessToken(username: string, password: string): Promise<IJwtToken> {
    logger.info('geting getAccessToken:')
    const data = await getCognitoUserAccessToken(username, password)
    return {
      idToken: data.getIdToken().getJwtToken(),
      accessToken: data.getAccessToken().getJwtToken(),
      refreshToken: data.getRefreshToken().getToken(),
    }
  }

  async refreshSession(refresh_token: string): Promise<any> {
    return await refreshToken(refresh_token)
  }

  public async createWhitelistAddress(
    input: CreateWhiteListAddressInput,
    user_id: string,
  ): Promise<ICreateWhiteList> {
    const res1 = this.isSansactionAddress(input.whitelist_address)
    const res2 = this.isWhiteListedExists(user_id)
    const [resp, message] = await Promise.all([res1, res2])
    if (!_.isEmpty(resp?.message)) {
      return {
        message: resp?.message,
      }
    }
    if (!_.isEmpty(message?.message)) {
      return {
        message: message?.message,
      }
    }

    const isWhiteListed = await this.alchemyResolver.whitelistAddresses(
      input.whitelist_address,
    )
    if (isWhiteListed.result === 'Whitelisting Successful') {
      const result1 = createWhiteListInDB({
        user_id,
        whitelistAddress: input.whitelist_address,
      })

      const result2 = updateCognitoUser({
        user_id,
        permission: {
          blockchain_address: true,
        },
      })
      await Promise.all([result1, result2])
      await this.switchRole(user_id)
      return {
        message: SuccessMsg('USER-S1'),
      }
    }
    return {
      message: ErrorMsg('USER-S6'),
    }
  }

  public async checkUserInCognitoService(user_id: string): Promise<boolean> {
    const isUserPresent = await checkUserInCognitoDB({
      user_id,
    })
    return isUserPresent ? true : false
  }

  public async checkKycAndEtheriumAddress(user_id: string): Promise<boolean> {
    /* 
    Need to check the permission for CodeCommit
    const codeCommit = new AWS.CodeCommit()
    const fileContent = await codeCommit.getFile
    ({ filePath: 'ccr-3blk-tools-uea1-3blocks-core/src/resources/blockchain/Tkn3blks.json', 
    repositoryName: 'ccr-3blk-tools-uea1-3blocks-core' })
    .promise()
    logger.log(fileContent) 
    */
    const userObject = await getUserInfoByUserId({
      user_id,
    })
    if (userObject?.whitelistAddress && userObject?.kycStatus) {
      return true
    }
    return false
  }

  public async getPpmDocAgreementService(
    user_id: string,
    re_id: string,
  ): Promise<UserDBSchema> {
    const resp = await getDocAgreementDB({ user_id, re_id })
    processEmptyListOrObject(resp)
    const json: UserDBSchema = {
      re_id: resp?.re_id,
      user_id: resp?.user_id,
    }
    if (resp?.ppmAgreement) {
      json.ppmAgreement = resp?.ppmAgreement || false
      json.ppmAgreementTimestamp = resp?.ppmAgreementTimestamp
    }
    if (resp?.operatingAgreement) {
      json.operatingAgreement = resp?.operatingAgreement || false
      json.operatingAgreementTimestamp = resp?.operatingAgreementTimestamp
    }
    return resp
  }

  public async createSubscriptionAgreement(
    user_id: string,
    re_id: string,
    subscriptionAccepted: boolean,
    totalNumberOfTokens: number,
    tokenPrice: number,
    tokensInThisOrder: number,
  ): Promise<any> {
    if (!subscriptionAccepted) {
      throw new BaseError(
        HttpStatus.BAD_REQUEST,
        'you are not allowed to send false for subscription agreement.',
      )
    }
    const subscriptionId = uuid()
    const subscriptionTimestamp = moment(new Date()).format(AgreementDocTimestamp)
    await createSubscriptionAgreementDB({
      re_id,
      user_id,
      subscriptionId,
      subscriptionTimestamp,
      subscriptionAccepted,
      amount: tokenPrice * tokensInThisOrder,
      totalNumberOfTokens,
      tokenPrice,
      tokensInThisOrder,
    })
    return {
      user_id,
      re_id,
      subscriptionId,
      subscriptionTimestamp,
      subscriptionAccepted,
      amount: tokenPrice * tokensInThisOrder,
      totalNumberOfTokens,
      tokenPrice,
      tokensInThisOrder,
    }
  }

  async getSubscriptionAgreement(user_id: string, re_id: string): Promise<any> {
    const resp = await getSubscriptionAgreementDB({
      user_id,
      re_id,
    })
    processEmptyListOrObject(resp)
    return resp
  }

  async getUserReffralService(user_id: string, _query: string): Promise<any> {
    const resp = await getUserRefral({
      user_id,
    })
    processEmptyListOrObject(resp)
    return resp
  }
  public async updatePpmDocAgreementService(
    user_id: string,
    re_id: string,
    ppmAccepted: boolean,
    operatingAccepted: boolean,
  ): Promise<any> {
    const json = {}
    if (ppmAccepted) {
      json['ppmAgreement'] = ppmAccepted
    }
    if (operatingAccepted) {
      json['operatingAgreement'] = operatingAccepted
    }
    return await updateDocAgreementDB({
      user_id,
      re_id,
      ...json,
      ppmAgreementTimestamp: moment(new Date()).format(AgreementDocTimestamp),
      operatingAgreementTimestamp: moment(new Date()).format(AgreementDocTimestamp),
    })
  }

  public async switchRole(user_id: string, roleInput?: any) {
    const userInfo = await getUserInfoByUserId({ user_id })
    const newRole = this.getNewRole(userInfo, roleInput)
    let newRolePermission = {} as IUserRolePermission
    if (!_.isEmpty(newRole)) {
      for (const key in newRole) {
        if (newRole[key]) {
          newRolePermission = getPermissionOf(key)
        }
      }
    }
    if (!_.isEmpty(newRolePermission)) {
      await updateCognitoUserProps({
        user_id,
        ...userInfo,
        ...newRolePermission.permission,
        ...newRole,
      })
    }
  }

  public async switchRoleService(user_id: string, from: Role, to: Role) {
    try {
      await this.switchRole(user_id, { fromRole: from, toRole: to })
      return 'done.'
    } catch (e) {
      logger.error(`Error while switching the role Service ${JSON.stringify(e)}`)
      throw e
    }
  }

  public async cahngeRoleService(
    user_id: string,
    newRole: Role,
  ): Promise<ChangeRoleInf> {
    let newRolePermission = {} as IUserRolePermission
    const abc = setRoleForDB(newRole)
    newRolePermission = getPermissionOf(newRole)
    await updateCognitoUserProps({
      user_id,
      ...newRolePermission.permission,
      ...abc,
    })
    return {
      user_id,
      rolePermission: {
        role: [newRole],
        permission: newRolePermission.permission,
      },
    }
  }
  public async applyReferralCode(
    user_id: string,
    code: string,
    _query: string,
  ): Promise<any> {
    // Get referree User's date by Code GSI.
    const existing = await getUserRefral({ user_id })
    if (existing?.referrerCode || existing?.referrerUserId) {
      throw new BaseError(HttpStatus.CONFLICT, `Referral Code is already been applied.`)
    }
    const { referralCode, referrerUserId } = await this.getReferrerInfo(code, user_id)
    // Update User's information
    await updateCognitoUser({
      user_id,
      referralCode,
      referrerUserId,
    })
    return {
      user_id,
      referralCode,
      referrerUserId,
    }
  }

  public async getReferrerInfo(code: string, user_id: string) {
    const data: [UserResponseSchema] = await getUserByReffrarCode({
      referralCode: code,
    })
    // TODO: Coupon code not found error.
    if (_.isUndefined(data) || _.size(data) === 0) {
      throw new BaseError(HttpStatus.BAD_REQUEST, `Invalid Referral Code ${code}.`)
    }
    // Update User's information
    await updateCognitoUser({
      user_id,
      referrerCode: data[0]?.referralCode,
      referrerUserId: data[0].user_id,
    })
    return {
      referralCode: data[0]?.referralCode,
      referrerUserId: data[0]?.user_id,
    }
  }

  // TODO
  public async applyBonusToUser(user_id: string, orderAmount: number = 100) {
    const existinUserData = await getUserRefral({ user_id })
    if (!existinUserData?.referrerUserId) return

    const userData = await getOrderTransactionByUserId({
      user_id: existinUserData?.referrerUserId,
    })
    if (_.isUndefined(userData) || _.size(userData) === 0) {
      return
    }
    const months = getDateDiffInMonths(userData?.[0].updated_at)
    if (months <= 6) {
      const bonusAount = orderAmount * 0.2
      await applyBonusAmountDB({
        user_id: existinUserData?.referrerUserId,
        referralBonus: bonusAount,
      })
      // he made othe orders in last 6 months and apply the Bonus
    } else {
      // no bonus is apply.
    }
  }

  private async isSansactionAddress(whitelist_address: string) {
    const resp = await this.chainalysisService.getAddressSanctioned(whitelist_address)
    if (resp.identifications?.length > 0) {
      return {
        message: ErrorMsg('USER-S5', { address: whitelist_address }),
      }
    }
  }

  private async isWhiteListedExists(user_id: string) {
    const existingInfo = await getCognitoUserDetail({ user_id })
    if (existingInfo?.whitelistAddress) {
      return {
        message: ErrorMsg('USER-E1'),
      }
    }
  }

  private async mappedData(res: any): Promise<IGetCognitoUser> {
    const resp = convertObjectToSnakeCase(res)
    const role = getRole(resp)
    const permission = resp as IUserPermision
    const final: IUserRolePermission = {
      role,
      permission,
    }
    const data: IGetCognitoUser = {
      user_id: getIdFromString(resp, Keys.PK),
      user: {
        email: resp?.[`email`],
        firstname: resp?.['firstname'],
        lastname: resp?.['lastname'],
      },
      rolePermission: final,
      ...resp,
      kyc_completed: resp?.kyc_status,
    }
    return data
  }

  private async updateMappedData(resp: any): Promise<IUpdateCognitoUser> {
    const role = getRole(resp)
    const permission: IUserPermision = resp
    const final: IUserRolePermission = {
      role,
      permission,
    }
    const data: IUpdateCognitoUser = {
      user_id: resp.user_id,
      user: {
        email: resp[`email`],
      },
      rolePermission: final,
    }
    return data
  }

  private getRolePermission(user?: any): any {
    const rolePermission = getPermissionOf(user?.role || Role.Visitor)

    // Get the only permission
    const permission = rolePermission.permission

    // Get the only Role (In string)
    const roleInString = rolePermission.role[0]

    // Convert string to Enum
    const r: Role = roleInString as Role

    return {
      permission,
      role: [r],
    }
  }

  private getNewRole(userInfo: UserResponseSchema, roleInput: any): any {
    let newRole = {}
    if (roleInput?.fromRole && roleInput?.toRole) {
      newRole = this.changeRole(Role.Visitor, Role.Buyer)
      return newRole
    }
    if (userInfo.kycStatus && userInfo.blockchainAddress) {
      newRole = this.changeRole(Role.Visitor, Role.Buyer)
      return newRole
    }
    // add more condition here.
    // strech here for more condition.
    return newRole
  }

  private changeRole(from: Role, to: Role): { [key: string]: boolean } {
    return {
      [from]: false,
      [to]: true,
    }
  }
}
