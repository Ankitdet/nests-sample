import { AppResolver } from '@app/app.resolver'
import { MUTATION_METHOD_DECORATOR } from '@core/decorators'
import { QUERY_METHOD_DECORATOR } from '@core/decorators/query.decorator'
import {
  CreateWhiteListAddressInput,
  UpdateCognitoUserInput,
} from '@core/inputs/user/user.input'
import {
  ICreateCognitoUser,
  IGetCognitoUser,
  IUpdateCognitoUser,
} from '@core/interfaces/user/create-cognito-user.interface'
import { ICreateWhiteList } from '@core/interfaces/user/create-whitelist.interface'
import { IJwtToken, IRefreshSession } from '@core/interfaces/user/jwt.interface'
import { ChangeRoleType, ScalarObjectType, UserType } from '@core/object-types'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryFromRequest } from '@shared/decorators'
import { CurrentUser } from '@shared/decorators/current-user.decorator'
import { ArgsValidationPipe, UUIDValidationPipe } from '@shared/pipe/args.pipe'
import {
  /* generateProjectionQueryFromReq */ /* generateProjectionQueryFromReq */ Role,
} from '@utils/index'
import { logger } from '../../shared/logger/logger'
import { listLastUpdatedUserCognito } from '../../utils/user/cognito.util'
// import { secretManagerClient } from '@utils/secret-manager/cache-manager'
/* import { UserTypeProjectTest } from '../../core/object-types/user/prtojection.type'
import { secretManagerClient } from '../../utils/secret-manager/cache-manager' */
// import { secretManagerClient } from '@utils/secret-manager/cache-manager'
// import { UserTypeProjectTest } from '../../core/object-types/user/prtojection.type'
import { UserService } from './user.service'

@Resolver(() => UserType)
export class UserResolver extends AppResolver {
  constructor(private readonly userService: UserService) {
    super()
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.createCognitoUser.return,
    MUTATION_METHOD_DECORATOR.createCognitoUser.options,
  )
  async createCognitoUser(@CurrentUser() user: any): Promise<ICreateCognitoUser> {
    return await this.userService.createCognitoUser(user.email, user?.['sub'])
  }

  @Query(
    QUERY_METHOD_DECORATOR.getUserAccess.return,
    QUERY_METHOD_DECORATOR.getUserAccess.options,
  )
  async getCognitoUserDetail(
    @Args('user_id') user_id: string,
  ): Promise<IGetCognitoUser> {
    return await this.userService.getCognitoUserDetail(user_id)
  }

  @Query(
    QUERY_METHOD_DECORATOR.loggedInUserAccess.return,
    QUERY_METHOD_DECORATOR.loggedInUserAccess.options,
  )
  async getLoggedInUserDetail(@CurrentUser() user: any): Promise<IGetCognitoUser> {
    return await this.userService.getCognitoUserDetail(user?.['sub'])
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.updateCognitoUser.return,
    MUTATION_METHOD_DECORATOR.updateCognitoUser.options,
  )
  async updateCognitoUser(
    @Args('input') input: UpdateCognitoUserInput,
    @CurrentUser() user: any,
  ): Promise<IUpdateCognitoUser> {
    input['user_id'] = input?.user_id || user?.['sub']
    const data = await this.userService.updateCognitoUser(input)
    return data
  }

  @Query(
    QUERY_METHOD_DECORATOR.accessToken.return,
    QUERY_METHOD_DECORATOR.accessToken.options,
  )
  async getAccessToken(
    @Args('username', ArgsValidationPipe) username: string,
    @Args('password', ArgsValidationPipe) password: string,
  ): Promise<IJwtToken> {
    logger.info('Username inside GetAccesToken')
    return this.userService.getAccessToken(username, password)
  }

  @Query(
    QUERY_METHOD_DECORATOR.refreshSession.return,
    QUERY_METHOD_DECORATOR.refreshSession.options,
  )
  async refreshSession(
    @Args('refreshToken', ArgsValidationPipe) refresh_token: string,
  ): Promise<IRefreshSession> {
    const resp = await this.userService.refreshSession(refresh_token)
    return {
      accessToken: resp.accessToken,
      idToken: resp.idToken,
    }
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.updateEthereumAddress.return,
    MUTATION_METHOD_DECORATOR.updateEthereumAddress.options,
  )
  async createWhitelistAddress(
    @Args('input') input: CreateWhiteListAddressInput,
    @CurrentUser() user: any,
  ): Promise<ICreateWhiteList> {
    const user_id = input?.user_id || user?.['sub']
    const data = await this.userService.createWhitelistAddress(input, user_id)
    return data
  }

  @Query(
    QUERY_METHOD_DECORATOR.checkUserInCognito.return,
    QUERY_METHOD_DECORATOR.checkUserInCognito.options,
  )
  async checkUserInCognitoResolver(
    @Args('user_id', UUIDValidationPipe) user_id: string,
  ): Promise<boolean> {
    return this.userService.checkUserInCognitoService(user_id)
  }

  @Query(
    QUERY_METHOD_DECORATOR.checkKycAndEtheriumAddress.return,
    QUERY_METHOD_DECORATOR.checkKycAndEtheriumAddress.options,
  )
  async checkKycAndEtheriumAddress(
    @Args('user_id', UUIDValidationPipe) user_id: string,
  ): Promise<boolean> {
    return this.userService.checkKycAndEtheriumAddress(user_id)
  }

  @Query(
    QUERY_METHOD_DECORATOR.getPpmOrOperatingDocAgreement.return,
    QUERY_METHOD_DECORATOR.getPpmOrOperatingDocAgreement.options,
  )
  async getPpmOrOperatingDocAgreement(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @Args('re_id', UUIDValidationPipe) re_id: string,
  ): Promise<any> {
    return this.userService.getPpmDocAgreementService(user_id, re_id)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.updatePpmOrOperatingDocAgreement.return,
    MUTATION_METHOD_DECORATOR.updatePpmOrOperatingDocAgreement.options,
  )
  async updatePpmOrOperatingDocAgreement(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @Args('re_id', UUIDValidationPipe) re_id: string,
    @Args('ppmAccepted', { nullable: true }) ppmAccepted: boolean,
    @Args('operatingAccepted', { nullable: true }) operatingAccepted: boolean,
  ): Promise<any> {
    return this.userService.updatePpmDocAgreementService(
      user_id,
      re_id,
      ppmAccepted,
      operatingAccepted,
    )
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.createSubscriptionAgreement.return,
    MUTATION_METHOD_DECORATOR.createSubscriptionAgreement.options,
  )
  async createSubscriptionAgreement(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @Args('re_id', UUIDValidationPipe) re_id: string,
    @Args('subscriptionAccepted', { nullable: false }) subscriptionAccepted: boolean,
    @Args('totalNumberOfTokens', { nullable: false }) totalNumberOfTokens: number,
    @Args('tokenPrice', { nullable: false }) tokenPrice: number,
    @Args('tokensInThisOrder', { nullable: false }) tokensInThisOrder: number,
  ): Promise<any> {
    return this.userService.createSubscriptionAgreement(
      user_id,
      re_id,
      subscriptionAccepted,
      totalNumberOfTokens,
      tokenPrice,
      tokensInThisOrder,
    )
  }

  @Query(
    QUERY_METHOD_DECORATOR.getSubscriptionAgreement.return,
    QUERY_METHOD_DECORATOR.getSubscriptionAgreement.options,
  )
  async getSubscriptionAgreement(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @Args('re_id', UUIDValidationPipe) re_id: string,
  ): Promise<any> {
    return this.userService.getSubscriptionAgreement(user_id, re_id)
  }

  @Query(
    QUERY_METHOD_DECORATOR.getUserReffral.return,
    QUERY_METHOD_DECORATOR.getUserReffral.options,
  )
  async getUserReffral(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @QueryFromRequest() query: string,
  ): Promise<any> {
    return this.userService.getUserReffralService(user_id, query)
  }

  @Mutation(() => String, {
    name: 'switchRole',
    description:
      ' switching the role from and to. you need token id in order to access.',
    deprecationReason: 'deprecated API.',
  })
  async switchRole(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @Args('token_id') token_id: string,
    @Args({ name: 'fromRole', type: () => Role }) fromRole: Role,
    @Args({ name: 'toRole', type: () => Role }) toRole: Role,
  ): Promise<any> {
    if (token_id !== 'fa2073e4-34f8-4373-82ef-8fa6d50593cf') {
      return 'You are not authorized to access this API, connect with Admin.'
    }
    return this.userService.switchRoleService(user_id, fromRole, toRole)
  }

  @Mutation(() => ChangeRoleType, {
    name: 'changeRole',
    description: ' changing the role',
    deprecationReason: 'deprecated API.',
  })
  async changeRole(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @Args('token_id') token_id: string,
    @Args({ name: 'role', type: () => Role }) role: Role,
  ): Promise<any> {
    if (token_id !== 'fa2073e4-34f8-4373-82ef-8fa6d50593cf') {
      return 'You are not authorized to access this API, connect with Admin.'
    }
    return this.userService.cahngeRoleService(user_id, role)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.applyReffralCode.return,
    MUTATION_METHOD_DECORATOR.applyReffralCode.options,
  )
  async applyRefferalCode(
    @Args('user_id', UUIDValidationPipe) user_id: string,
    @Args('refferalCode') refferalCode: string,
    @QueryFromRequest() query: string,
  ): Promise<any> {
    return this.userService.applyReferralCode(user_id, refferalCode, query)
  }

  @Query(() => ScalarObjectType, {
    name: 'listLastUpdatedUserCognito',
  })
  async listLastUpdatedUserCognito(): Promise<any> {
    // await secretManagerClient.setLatestVersion('PYSWJZEAXA')
    // const res = await secretManagerClient.get('TEST3BLOCKS')
    // const res1 = await secretManagerClient.resetCache('TEST3BLOCKS')
    // Logger.log(JSON.stringify(res1))
    // const projectionQuery = await generateProjectionQueryFromReq(query)
    // Logger.log(JSON.stringify(projectionQuery))
    return { payload: await listLastUpdatedUserCognito() }
  }
}
