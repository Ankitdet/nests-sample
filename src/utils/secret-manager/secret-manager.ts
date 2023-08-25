import { AWS_CREDENTIAL } from '@const/environments'
import * as AWS from 'aws-sdk'
import { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager'

// Create a Secrets Manager client
export const client_secrets_manager = new AWS.SecretsManager({
  ...AWS_CREDENTIAL,
})

export const secretsValue = async (key: string): Promise<GetSecretValueResponse> => {
  try {
    return await client_secrets_manager
      .getSecretValue({ SecretId: key, VersionStage: 'AWSCURRENT' })
      .promise()
  } catch (err) {
    if (err) {
      if (err.code === 'DecryptionFailureException')
        // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw new Error(JSON.stringify(err))
      else if (err.code === 'InternalServiceErrorException')
        // An error occurred on the server side.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw new Error(JSON.stringify(err))
      else if (err.code === 'InvalidParameterException')
        // You provided an invalid value for a parameter.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw new Error(JSON.stringify(err))
      else if (err.code === 'InvalidRequestException')
        // You provided a parameter value that is not valid for the current state of the resource.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw new Error(JSON.stringify(err))
      else if (err.code === 'ResourceNotFoundException')
        // We can't find the resource that you asked for.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw new Error(JSON.stringify(err))
    }
  }
}
// https://github.com/endre-synnes/python_aws_course/blob/main/lambda_intro/04_secrets_and_databases_and_stuff/17_rotate_secrets.py
// https://github.com/aws-samples/aws-secrets-manager-rotation-lambdas/blob/master/SecretsManagerRDSMySQLRotationMultiUser/lambda_function.py
// https://zaccharles.medium.com/store-and-rotate-api-keys-with-aws-secrets-manager-26f7f7a6c211
// https://blog.mechanicalrock.io/2020/02/03/secrets-rotation-with-secrets-manager.html
