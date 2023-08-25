import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
// import { generateReferralCode } from '@utils/index'
import serverlessExpress from '@vendia/serverless-express'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyHandlerV2,
  Handler,
  SQSEvent,
} from 'aws-lambda'
import { useContainer } from 'class-validator'
import express from 'express'
import { graphqlUploadExpress } from 'graphql-upload'
import _ from 'lodash'
import { AppModule } from './app/app.module'
import * as Trigger from './constants/common.const'
/* import {
  create_secret,
  finish_secret,
  set_secret,
  test_secret,
} from './utils/secret-manager/rotation-secret'
import { client_secrets_manager } from './utils/secret-manager/secret-manager' */
import { Environments } from './core/enums'
import { cache } from './global-vars'
import { awsSesService, sqsService, userService, zillowService } from './modules'
import { convertImagesToWebp } from './modules/s3-buckets/s3utils'
import { LoggingInterceptor } from './shared/interceptor'
import { lambdaTimeout, LogInfo } from './utils'
import { SecretManager } from './utils/secret-manager/rotation-secret'
import { checkIfUserExists } from './utils/user/cognito.util'

let cachedServer: Handler
const createResponse = async (status: number, body: any) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(body),
  }
}

const isCachedServerBootStraped = async () => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer()
  }
}

const bootstrapServer = async (): Promise<Handler> => {
  const expressApp = express()
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: false,
  })
  app
    .use(
      express.urlencoded({
        extended: true,
      }),
    )
    .use(express.json({ limit: '1mb' }))

  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  })
  app.use(
    graphqlUploadExpress({
      maxFileSize: 400000000, // 20 mb
      maxFiles: 10, // 10 files
    }),
  )
  app.enableShutdownHooks()
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(
    new LoggingInterceptor() /* new ResponseHeaderInterceptor() */,
  )
  express.raw({
    type: '*/*',
  })
  await app.init()
  return serverlessExpress({
    app: expressApp,
  })
}

export const zillow: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context,
  callback,
) => {
  await isCachedServerBootStraped()
  event.headers = {
    ...event.headers,
    'Access-Control-Allow-Origin': '*',
  }
  return cachedServer(event, context, callback)
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context,
  callback,
) => {
  await isCachedServerBootStraped()
  event.headers = {
    ...event.headers,
    'Access-Control-Allow-Origin': '*',
  }
  return cachedServer(event, context, callback)
}

export const ws: APIGatewayProxyHandlerV2 = async (event, _context) => {
  await isCachedServerBootStraped()
  LogInfo('3blocks Lmbda handler calling websocket')
  return {
    event,
    statusCode: 200,
  }
}

export const preSignUp = async (event: any, _context: any, _callback: any) => {
  await isCachedServerBootStraped()
  LogInfo(`[PreSignUp] Reciving Request Object`, `${JSON.stringify(event.request)}`)
  LogInfo(`[PreSignUp] Event Object, ${JSON.stringify(event)}`)
  const user = event?.request?.userAttributes
  try {
    await checkIfUserExists(user?.email)
  } catch (e) {
    Logger.error(`[PreSignUp-Error] ${JSON.stringify(e)}`)
    // callback(null, JSON.stringify(e))
    _context.fail(JSON.stringify(e))
  }
  // return to the Cognito
  _context.done(null, event)
}

export const postConfirmation = async (event: any, context: any, _callback: any) => {
  await isCachedServerBootStraped()
  if (
    event.request.userAttributes.email &&
    event.triggerSource === Trigger.PostConfirmationConfirmSignUp
  ) {
    // const user = event?.request?.userAttributes
    /* 
    { "sub": "88ebea25-56aa-4b22-ad6a-153d2a04c272",
        "email_verified": "true",
        "cognito:user_status": "CONFIRMED",
        "cognito:email_alias": "mpere@tuta.io",
        "name": "Mpere",
        "family_name": "Tuta",
        "email": "mpere@tuta.io"
      } */
    LogInfo(`Events: ${JSON.stringify(event)}`)

    const user = event?.request?.userAttributes
    try {
      // const code = await generateReferralCode()
      await userService.createCognitoUser(
        {
          email: user?.email,
          firstname: user?.name,
          lastname: user?.family_name,
          // referralCode: code,
        },
        user?.sub,
      )
    } catch (e) {
      Logger.error(`[PostConfirmation-Error] ${JSON.stringify(e)}`)
      context.fail(JSON.stringify(e))
    }
  }
  context.done(null, event)
}

export const consumer = async (sqsMessage: SQSEvent, _context: any, callback: any) => {
  await isCachedServerBootStraped()
  const records = sqsMessage?.Records
  LogInfo(`Consumer is calling...`)
  try {
    await sqsService.processingQueue(records)
  } catch (e) {
    Logger.error(JSON.stringify(e))
    callback(null, createResponse(e?.status, e))
  }
  return {
    statusCode: 200,
  }
}

export const customMessage = async (event: any, context: any, callback: any) => {
  await isCachedServerBootStraped()
  LogInfo(
    `Custom Message lambda function is calling events. ${JSON.stringify(
      event.request,
    )}`,
  )
  try {
    await awsSesService.customMessageTrigger(event)
  } catch (e) {
    Logger.error(JSON.stringify(e))
    callback(null, createResponse(e?.status, e))
  }
  context.done(null, event)
}

export const imageProcessing = async (event: any, context: any, _callback: any) => {
  await isCachedServerBootStraped()
  LogInfo(`imageProcessing. ${JSON.stringify(event?.queryStringParameters)}`)
  const { key } = event?.queryStringParameters
  if (cache && !_.isEmpty(cache)) {
    Logger.log(`cacheing testing. : ${JSON.stringify(cache)}`)
  } else {
    cache[`ankit`] = 'test'
  }
  let resp = null
  try {
    resp = await convertImagesToWebp(key)
  } catch (e) {
    Logger.error(JSON.stringify(e))
    context.fail(JSON.stringify(e))
  }
  // callback(response_error, response_success)
  if (resp === 'image conversation done.') {
    _callback(null, {
      statusCode: 200,
      body: JSON.stringify(resp),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    })
  } else {
    const test = {
      statusCode: 400,
      body: JSON.stringify(resp),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
    _callback(JSON.stringify(test))
  }
}

// Secret Rotation
export const secretRotationLambda = async (
  event: any,
  _context: any,
  _callback: any,
) => {
  LogInfo(event)
  await lambdaTimeout({
    time: 1,
    message: 'secretRotationLambda is calling after 1 sec.',
  })
  await SecretManager(event)
}

export const syncingAllServices = async (event: any, _context: any, _callback: any) => {
  Logger.log(`Entering into the syncingAllServices : ${JSON.stringify(event)}`)
  const decoded = JSON.parse(Buffer.from(event.body, 'base64').toString())
  // Mapping all the keys from request object
  const requestData = decoded?.data?.uploadMultipleCsvs
  // Make sure requestData is an Array and length must be greater than 0
  if (Array.isArray(requestData) && requestData.length > 0) {
    await zillowService.syncingAllServices(requestData)
    Logger.log(requestData)
  } else {
    Logger.warn(`No data found from request body: ${requestData}`)
  }
  _callback(null, {
    statusCode: 200,
    body: JSON.stringify('syncingAllServices !!! done !!!'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}

export const syncingZillow = async (event: any, _context: any, _callback: any) => {
  Logger.log(`Entering into the syncingZillow : ${JSON.stringify(event)}`)
  const decoded = JSON.parse(Buffer.from(event.body, 'base64').toString())
  // Mapping all the keys from request object
  const requestData = decoded?.data?.address
  // Make sure requestData is an Array and length must be greater than 0
  if (Array.isArray(requestData) && requestData.length > 0) {
    await zillowService.syncingZillow(requestData)
    Logger.log(requestData)
  } else {
    Logger.warn(`No data found from request body: ${requestData}`)
  }
  _callback(null, {
    statusCode: 200,
    body: JSON.stringify('syncingZillow !! done !!!'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}

export const updateMarketCapitalisation = async (
  event: any,
  _context: any,
  _callback: any,
) => {
  Logger.log(`Entering into the updateMarketCapitalisation : ${JSON.stringify(event)}`)
  // Make sure requestData is an Array and length must be greater than 0
  await zillowService.updateMarketCapitalisation()
  _callback(null, {
    statusCode: 200,
    body: JSON.stringify('UpdateMarketCapitalisation !! done !!!'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}

export const historicalData = async (event: any, _context: any, _callback: any) => {
  Logger.log(`Entering into the historicalData : ${JSON.stringify(event)}`)
  // Make sure requestData is an Array and length must be greater than 0
  // const data = JSON.parse(Buffer.from(event.body, 'base64').toString())
  // const topic = data?.topic
  // await zillowService.triggerHistoricalDataCreationServ(topic)
  _callback(null, {
    statusCode: 200,
    body: JSON.stringify('HistoricalData !! done !!!'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}

export const syncingBlockChain = async (event: any, _context: any, _callback: any) => {
  Logger.log(`Entering into the syncingBlockChain : ${JSON.stringify(event)}`)
  const decoded = JSON.parse(Buffer.from(event.body, 'base64').toString())
  // Mapping all the keys from request object
  const requestData = decoded?.data?.platform
  const key = decoded?.data?.key
  if (!requestData || !key) {
    _callback(null, {
      statusCode: 400,
      body: JSON.stringify(`Bad Request realt platform must have Key`),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    })
  }
  await zillowService.syncingBlockChain(requestData, key)
  Logger.log(requestData)
  _callback(null, {
    statusCode: 200,
    body: JSON.stringify(`Syncing ${requestData} BlockChain !! done !!!`),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}

export const sanitizatingDigitalReBucket = async (
  event: any,
  _context: any,
  _callback: any,
) => {
  Logger.log(`Entering into the sanitizatingDigitalReBucket : ${JSON.stringify(event)}`)
  await zillowService.sanitizingDigitalReBucket()
  _callback(null, {
    statusCode: 200,
    body: JSON.stringify(`Sanitization !! done !!!`),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}

export const migratingDB = async (event: any, _context: any, _callback: any) => {
  Logger.log(`Entering into the migratingDB : ${JSON.stringify(event)}`)
  const decoded = JSON.parse(Buffer.from(event.body, 'base64').toString())
  // Mapping all the keys from request object
  const stgEnv = decoded?.stage
  if (stgEnv === Environments.STAGE || stgEnv === Environments.PROD) {
    await zillowService.migratingDBs(decoded)
  } else {
    _callback(null, {
      statusCode: 400,
      body: JSON.stringify('Bad Request, only stg or prod is allowed.'),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    })
  }
  _callback(null, {
    statusCode: 200,
    body: JSON.stringify(`Migration !! done !!!`),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  })
}
