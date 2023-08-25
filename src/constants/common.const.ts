import { getRouterName, RouterName } from '@core/enums/router-name.enum'
import { MUTATION_METHOD_DECORATOR, QUERY_METHOD_DECORATOR } from '../core/decorators'
import { logger } from '../shared/logger/logger'

export const dbLogger = () => {
  const DBLogger = '[DBLogger]'
  return {
    log: (args: any) => logger.info(`${DBLogger} ${args}`),
    debug: (args: any) => logger.debug(`${DBLogger} ${args}`),
    error: (args: any) => logger.error(`${DBLogger} ${args}`),
    warn: (args: any) => logger.warn(`${DBLogger} ${args}`),
    verbose: (args: any) => logger.verbose(`${DBLogger} ${args}`),
  }
}

export const CustomMessageSignUp = 'CustomMessage_SignUp'
export const CustomMessageAdminCreateUser = 'CustomMessage_AdminCreateUser'
export const CustomMessageResendCode = 'CustomMessage_ResendCode'
export const CustomMessageForgotPassword = 'CustomMessage_ForgotPassword'
export const CustomMessageUpdateUserAttribute = 'CustomMessage_UpdateUserAttribute'
export const CustomMessageVerifyUserAttribute = 'CustomMessage_VerifyUserAttribute'
export const CustomMessageAuthentication = 'CustomMessage_Authentication'
export const PostConfirmationConfirmSignUp = 'PostConfirmation_ConfirmSignUp'

// Zillo Dital API, Validation not required.
export const zilloDigitalValidationNotRequired = [
  'uploadMultipleCsvs',
  'deleteFile',
  'createAkruHistoricalData',
  ...Object.keys(QUERY_METHOD_DECORATOR.zilloDigital),
  ...Object.keys(MUTATION_METHOD_DECORATOR.zilloDigital),
] as const

// Other API in 3blocks platform
export const tokenValidationNotRequiredFor = [
  getRouterName(RouterName.getAccessToken),
  getRouterName(RouterName.listFiles),
  getRouterName(RouterName.getRealEstateInfoListByIds),
  getRouterName(RouterName.getRealEstateInfoList),
  getRouterName(RouterName.getRealEstateBasicInfoById),
  getRouterName(RouterName.getRealEstateFinanceByReId),
  getRouterName(RouterName.checkUserInCognito),
  getRouterName(RouterName.refreshSession),
  getRouterName(RouterName.getRealEstateInfoById),
  ...zilloDigitalValidationNotRequired,
] as const

export const RoleValidationNotRequiredFor = [
  ...tokenValidationNotRequiredFor,
  getRouterName(RouterName.createUserInDynamo),
] as const

export enum SQSType {
  ORDER = 'Order',
  PANDADOC = 'Pandadoc',
}
