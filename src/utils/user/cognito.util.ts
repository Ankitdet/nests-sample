import { AWS_USER_POOLS_ID, USER_POOLS_CLIENT_ID } from '@const/environments'
import { HttpStatus } from '@nestjs/common'
import { BaseError } from '@shared/errors'
import { logger } from '@shared/logger/logger'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import * as AWS from 'aws-sdk'
import moment from 'moment'
import { ErrorMsg } from '../../resources/message'
import { AgreementDocTimestamp } from '../common.utils'
// import { ErrorMsg } from '../../resources/message'

export const getCognitoUserAccessToken = async (
  username: string,
  password: string,
): Promise<any> => {
  const authenticationData = {
    Username: username,
    Password: password,
  }
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData,
  )
  const poolData = {
    UserPoolId: AWS_USER_POOLS_ID,
    ClientId: USER_POOLS_CLIENT_ID,
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
  const userData = {
    Username: username,
    Pool: userPool,
  }
  logger.info(`user : ${JSON.stringify(userData)}`)

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  try {
    return new Promise((res, rej) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          logger.info('===========================')
          // Result methods: idToken,refreshToken,accessToken,clockDrift
          logger.info('Result methods: ' + Object.getOwnPropertyNames(result))
          // idToken methods: jwtToken,payload
          logger.info(
            'idToken methods: ' + Object.getOwnPropertyNames(result?.getIdToken()),
          )
          // accessToken methods: jwtToken,payload
          logger.info(
            'accessToken methods: ' +
              Object.getOwnPropertyNames(result.getAccessToken()),
          )
          // refreshToken methods: token
          logger.info(
            'refreshToken methods: ' +
              Object.getOwnPropertyNames(result.getRefreshToken()),
          )
          // ID token payload's method: sub,email_verified,gender,
          // iss,phone_number_verified,cognito:username,given_name,aud,event_id,token_use,auth_time,phone_number,exp,iat,family_name,email
          logger.info(
            'ID token payload\'s method: ' +
              Object.getOwnPropertyNames(result.getIdToken().payload),
          )
          // show the code on how to get cognito user's attribute, for example, its emailbox
          logger.info('user\'s mailbox: ' + result.getIdToken().payload.email)
          // Amazon Cognito issues three tokens to the client
          // https://amzn.to/2fo77UI
          /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing 
                  through an Authorization Header to an API Gateway Authorizer*/
          logger.info('===========================')
          logger.info('ID token: ' + result.getIdToken().getJwtToken())
          // logger.info('ID token: ' + result.getIdToken().getJwtToken());
          logger.info('===========================')
          logger.info('Access token: ' + result.getAccessToken().getJwtToken())
          // logger.info('Access token: ' + result.getAccessToken().getJwtToken());
          logger.info('===========================')
          logger.info('Refresh token: ' + result.getRefreshToken().getToken())
          // logger.info('Refresh token: ' + result.refreshToken.getToken());
          res(result)
        },
        onFailure(err) {
          logger.error({ error: err })
          rej(err)
        },
        /* newPasswordRequired: function (attributesData) {
          delete attributesData.email
          attributesData.family_name = 'detroja family'
          delete attributesData.email_verified
          attributesData.name = 'Ankit Detroj'
          cognitoUser.completeNewPasswordChallenge('Test@123', attributesData, this)
        } */
      })
    })
  } catch (e) {
    throw e
  }
}

export const refreshToken = async (refreshToken: string): Promise<any> => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()
  const resp = await cognitoidentityserviceprovider
    .adminInitiateAuth({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      UserPoolId: AWS_USER_POOLS_ID,
      ClientId: USER_POOLS_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    })
    .promise()
  return {
    accessToken: resp.AuthenticationResult.AccessToken,
    idToken: resp.AuthenticationResult.IdToken,
  }
}

export const checkIfUserExists = async (email: string): Promise<any> => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()
  try {
    const resp = await cognitoidentityserviceprovider
      .listUsers({
        UserPoolId: AWS_USER_POOLS_ID,
        Filter: `email =\'${email?.toLowerCase()}\'`,
        AttributesToGet: ['email'],
      })
      .promise()
    if (resp.Users.length > 0) {
      // return true
      if (resp.Users[0].UserStatus === 'EXTERNAL_PROVIDER') {
        if (resp.Users[0].Username.startsWith('google')) {
          throw new BaseError(HttpStatus.CONFLICT, ErrorMsg('USER-S4'))
        }
      } else {
        throw new BaseError(
          HttpStatus.CONFLICT,
          ErrorMsg('USER-S3', { email: email?.toLowerCase() }),
        )
      }
    }
    // return false
  } catch (e) {
    logger.error({ error: JSON.stringify(e) })
    throw e
  }
}

export const listLastUpdatedUserCognito = async (): Promise<any> => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()
  try {
    const resp = await cognitoidentityserviceprovider
      .listUsers({
        UserPoolId: AWS_USER_POOLS_ID,
      })
      .promise()

    const modifiedUsers: any = resp?.Users.map(a => {
      const resp = moment(a.UserLastModifiedDate).format(AgreementDocTimestamp)
      return {
        email: a.Attributes.filter(b => b.Name === 'email'),
        createdDate: a.UserCreateDate,
        UserLastModifiedDate: resp,
      }
    })
    const newUsers: any = modifiedUsers?.sort(
      (a, b) =>
        new Date(b.UserLastModifiedDate).getTime() -
        new Date(a.UserLastModifiedDate).getTime(),
    )
    logger.info(newUsers)
    return newUsers
    // return false
  } catch (e) {
    logger.error({ error: JSON.stringify(e) })
    throw e
  }
}
