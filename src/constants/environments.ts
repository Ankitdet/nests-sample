import { Environments } from '@core/enums'
import * as dotenv from 'dotenv'
import path from 'path'
import { logger } from '../shared/logger/logger'

// Setting Up the Env and Node Env
export const LOCAL = Environments.LOCAL
export const DEVELOPMENT = Environments.DEV
export const PRODUCTION = Environments.PROD
export const NODE_ENV: string = process.env.NODE_ENV || DEVELOPMENT

logger.info(`[NODE_ENV]: ${NODE_ENV}`)
// Get the environment variable from 'env' folder.
// In other env will get from lambda Environment
if (NODE_ENV === LOCAL) {
  const resp = dotenv.config({
    path: path.resolve(__dirname, '../../env/', `.env.${process.env.NODE_ENV}`),
  })
  if (resp.error) {
    dotenv.config({
      path: path.resolve(__dirname, '../../env/', `.env.dev`),
    })
  }
}
// Author
export const AUTHOR: string = process.env.AUTHOR || 'ankit'
// Application
export const DOMAIN: string = process.env.DOMAIN || 'localhost'
export const END_POINT: string = process.env.END_POINT || 'graphql'

export const STAGE: string = process.env.STAGE || 'local'
export const PORT: number = Number(process.env.PORT) || 3000

export const AWS_REGION = process.env.REGION || 'us-east-1'

// AWS Cognito Setup
export const AWS_USER_POOLS_ID = process.env.AWS_USER_POOLS_ID || 'us-east-1_oUSrvMj6K'
export const USER_POOLS_CLIENT_ID =
  process.env.USER_POOLS_CLIENT_ID || '3m1fqcbd6f3jrj5vrfr6f1pede'

// AWS S3 bucket
export const BUCKET_NAME = process.env.BUCKET_NAME || 'file-uploads-images'
export const DEFAULT_FILES_ACL = process.env.DEFAULT_FILES_ACL || 'public-read'

// Only Locally Testing Creds
export const IAM_USER_KEY = process.env.IAM_USER_KEY || ''
export const IAM_USER_SECRET = process.env.IAM_USER_SECRET || ''

logger.level =
  STAGE === Environments.LOCAL || Environments.DEV || Environments.STAGE
    ? 'info'
    : 'error'
// Setting up AWS secret and id and Session token
const CREDS = {
  secretAccessKey:
    NODE_ENV === LOCAL ? IAM_USER_SECRET : process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: NODE_ENV === LOCAL ? IAM_USER_KEY : process.env.AWS_ACCESS_KEY_ID,
  region: AWS_REGION,
}

export const AWS_CREDENTIAL =
  NODE_ENV === LOCAL
    ? { ...CREDS }
    : {
        ...CREDS,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      }
logger.info({ ...AWS_CREDENTIAL })

// Log Level
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

export const BASE_ON_CALCULATE_TOKEN =
  Number(process.env.BASE_ON_CALCULATE_TOKEN) || 10000
export const TOKEN_PER_BASE = Number(process.env.TOKEN_PER_BASE) || 200

// Estate API Key
export const ESTATE_BASE_URL =
  process.env.ESTATE_BASE_URL || 'https://apis.estated.com/v4/property'
export const ESTATE_TOKEN = process.env.ESTATE_TOKEN || 'MjMnkgS6lLNq1sFsKUFdtAxaMLB9EN'

// Onfido Key
export const ONFIDO_API_TOKEN =
  process.env.ONFIDO_API_TOKEN ||
  'api_sandbox_us.KcZkJDBnWuy.0NnM_0NPDGDmt9Wp4T9STLFDASFs_CI0'
export const ONFIDO_WORKFLOW_RUN =
  process.env.ONFIDO_WORKFLOW_RUN || 'https://api.us.onfido.com/v3.5/workflow_runs'

// Dynamodb Table Name
export const DB_TABLE_NAME = process.env.DB_TABLE_NAME || 'mons-table'
export const USER_DB_TABLE_NAME = process.env.USER_DB_TABLE_NAME || '-'

// S3 Bucket
export const IMAGE_URL =
  process.env.IMAGE_URL || 'https://<bucket-name>.s3.amazonaws.com/<key>'

// Stripe
export const STRIPE_SECRET =
  process.env.STRIPE_SECRET ||
  'sk_test_51KsNsPKaISPMsVy2Nf6J2iAn8naUlzIN1f330bl0DW4df0vdXPyWv2SI7PKKudN9kVGR59u2I24aCybuYz3r4aWZ00mLy4NRwH'
export const STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET || 'whsec_UM0zCaHk8dij2y22BxIJFwRv1tN5uaFJ'

// Coinify
export const COINIFY_API_URL = process.env.COINIFY_API_URL || 'https://api.coinify.com'
export const COINIFY_API_SECRET =
  process.env.COINIFY_API_SECRET ||
  'Uu9YaqEmeux0+NXgBUwKStGk1wPJ5jrZFLXBgPMYOTkPxHnARtpp3h7DeQX/FPEv'
export const COINIFY_API_KEY =
  process.env.COINIFY_API_KEY ||
  'jnA9tpztcbwZaFHZVTISqolA6XnUU9Wpkf5kVhfzvgwEiNY8oVKVChCKpfhuae9y'
export const COINIFY_WEBHOOK =
  process.env.COINIFY_WEBHOOK || 'https://events.hookdeck.com/e/src_x4rDan2mfh8P'

// Alchemy blockchain Config
export const ALCHEMY_URL =
  process.env.ALCHEMY_URL || 'https://eth-ropsten.alchemyapi.io/v2/'
export const ALCHEMY_API_KEY =
  process.env.ALCHEMY_API_KEY || 'tdXlrCVwRdlSkRzCd9EGcKOsM3kdTI23'

export const ALCHEMY_POLYGON_URL =
  process.env.ALCHEMY_POLYGON_URL || 'https://polygon-mumbai.g.alchemy.com/v2/'
export const ALCHEMY_POLYGON_API_KEY =
  process.env.ALCHEMY_POLYGON_API_KEY || 'DGYXa5vi0Wxw4di2atl5E6KwLsV7aDMk'
export const ALCHEMY_POLYGON_TESTNET_NAME =
  process.env.ALCHEMY_POLYGON_TESTNET_NAME || 'maticmum'

export const ALCHEMY_RINKEBY_URL =
  process.env.ALCHEMY_RINKEBY_URL || 'https://eth-rinkeby.alchemyapi.io/v2/'
export const ALCHEMY_RINKEBY_API_KEY =
  process.env.ALCHEMY_RINKEBY_API_KEY || 'XNGLqnJ3SLchizbhbPSuyO8v0qBTuGtm'
export const ALCHEMY_RINKEBY_TESTNET_NAME =
  process.env.ALCHEMY_RINKEBY_TESTNET_NAME || 'rinkeby'

export const METAMASK_PRIVATE_KEY =
  process.env.METAMASK_PRIVATE_KEY ||
  '668fc934bf2ee4e686789a914ed89f4680e739cc4c40365404fd0f4250e53ec9'
// 'f9c9353757d80feb8fe202aa06831db24270011f037205bbca07527a0dd8baec'
export const SMART_CONTRACT_ADDRESS =
  process.env.SMART_CONTRACT_ADDRESS || '0x6f1fa06c655e75b6ed2d6a3b8b66594ca4289b85'
// '0x44C58ECB8C05ebCb71C118579b6fad94CDadb767'
// Smart Contract address is taken from - https://rinkeby.etherscan.io/address/0x75A30d9152f0af7ef16C280c4C573BeE79Bfe083
export const CONTRACT_OWNER_ADDRESS =
  process.env.CONTRACT_OWNER_ADDRESS || '0x673D7089E05CD16Dd9438Fe3EEdd1E657ffD0787'

// SES EMAIL Config
export const SES_EMAIL = process.env.SES_EMAIL || 'ankit@3blocks.io'
export const AWS_SQS_QUEUE_URL =
  process.env.AWS_SQS_QUEUE_URL ||
  'https://sqs.us-east-1.amazonaws.com/325502665956/sqs-3blk-dev-order-sqs-3blocks'
export const PANDA_DOC_SQS_QUEUE =
  process.env.PANDA_DOC_SQS_QUEUE ||
  'https://sqs.us-east-1.amazonaws.com/325502665956/pandadoc-webhook.fifo'

// Panda Doc
export const PANDA_DOC_ENDPOINT =
  process.env.PANDA_DOC_ENDPOINT || 'https://api.pandadoc.com/public/v1'
export const PANDA_DOC_API_KEY =
  process.env.PANDA_DOC_API_KEY || 'cfb9af942a7b8a7eb022160bf348c5db3293f9b7'
export const TEMPLATE_ID = process.env.TEMPLATE_ID || 'uDtajXgoDU7BBtiSvjoqcU'

// Google Recaptch
export const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || 'test'
export const DIGITAL_RE_BUCKET =
  process.env.DIGITAL_RE_BUCKET ||
  's3-3blk-digitalre-dev-uea1-std-3blocks-analytics-web-source'

export const ZILLOW_DIGITAL_RE_DB =
  process.env.ZILLOW_DIGITAL_RE_DB || 'ddb-3blk-dev-uea1-3blocks-Digital-RE'

export const RAPID_API_URL =
  process.env.RAPID_API_URL || 'https://zillow56.p.rapidapi.com'
export const RAPID_API_KEY =
  process.env.RAPID_API_KEY || '62f756f749msh6eb7f270e6137c7p133978jsnde969dec112d'
export const RAPID_API_HOST = process.env.RAPID_API_HOST || 'zillow56.p.rapidapi.com'

export const GNOSIS_API_KEY =
  process.env.GNOSIS_API_KEY || 'DTZE93TWSV55JR1WE4JYA9BUYKWQGXB4U1'
export const COMPANY_RE_DB = process.env.COMPANY_RE_DB || 'COMPANY_RE_DB'

export const SNOWTRACE_API_KEY =
  process.env.SNOWTRACE_API_KEY || 'HX8TZEH1831IYCNKD8ZS4NRGGAQXKQUJKQ'
