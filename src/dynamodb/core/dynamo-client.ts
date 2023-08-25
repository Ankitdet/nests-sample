import { AWS_CREDENTIAL, AWS_REGION } from '@const/environments'
import { Environments } from '@core/enums'
import { logger } from '@shared/logger/logger'
import AWS from 'aws-sdk'
let client: AWS.DynamoDB.DocumentClient = null

interface IClient {
  accessKeyId?: string
  secretAccessKey?: string
  region?: string
  apiVersion?: string
}

// Get Cross Account Creds by using the Assume Role.
export const getCrossAccountCreds = async () => {
  const sts = new AWS.STS({ region: AWS_REGION })
  const timeStamp = new Date().getTime()
  const assumeRoleStep1 = await sts
    .assumeRole({
      RoleArn:
        'arn:aws:iam::877174946546:role/iamr-3blk-stg-3blocks-CodePipelineCFAssumeRole',
      RoleSessionName: `CrossAccountCredentials-${timeStamp}`,
      DurationSeconds: 3600,
    })
    .promise()
  const accessParams = {
    accessKeyId: assumeRoleStep1.Credentials.AccessKeyId,
    secretAccessKey: assumeRoleStep1.Credentials.SecretAccessKey,
    sessionToken: assumeRoleStep1.Credentials.SessionToken,
  }
  logger.info(`Assume Role ${{ ...accessParams }}`)
  return accessParams
}

export const getDynamoDbClient = (_data?: IClient): AWS.DynamoDB.DocumentClient => {
  if (client) return client
  client = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    credentials: AWS_CREDENTIAL,
    httpOptions: {
      connectTimeout: 10000,
      timeout: 10000,
    },
    maxRetries: 3,
    convertEmptyValues: true,
  })

  if (process.env.TEST_ENV === Environments.LOCAL) {
    client = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:8000',
    })
  }

  return client
}
