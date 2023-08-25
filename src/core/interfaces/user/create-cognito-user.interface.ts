import { CreateCognitoUserType, GetCognitoUserType } from '@core/object-types'

export interface ICreateCognitoUser extends CreateCognitoUserType {}

export interface IGetCognitoUser extends GetCognitoUserType {}

export interface IUpdateCognitoUser extends ICreateCognitoUser {}
