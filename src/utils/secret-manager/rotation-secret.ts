import { Logger } from '@nestjs/common'
import { cache } from '../../global-vars'
import { encyptDecrypt } from './crypto-js'
import { client_secrets_manager } from './secret-manager'

export const SecretManager = async (event: any) => {
  const { SecretId: arn, ClientRequestToken: token, Step: step } = event

  const metadata = await client_secrets_manager
    .describeSecret({ SecretId: arn })
    .promise()
  Logger.log(`metadata : ${JSON.stringify(metadata)}`)
  if (!metadata.RotationEnabled) {
    throw new Error(`Secret ${arn} is not enabled for rotation`)
  }

  const { VersionIdsToStages: versions } = metadata
  if (!Object.keys(versions).includes(token)) {
    throw new Error(
      `Secret Version ${token} has no stage for rotation of secret ${arn}`,
    )
  } else if (versions[token].includes('AWSCURRENT')) {
    return
  } else if (!versions[token].includes('AWSPENDING')) {
    throw new Error(
      `Secret version ${token} not set as AWSPENDING for rotation of secret ${arn}.`,
    )
  }

  switch (step) {
    case 'createSecret':
      return await createSecret(client_secrets_manager, arn, token)
    case 'setSecret':
      return await setSecret(client_secrets_manager, arn, token)
    case 'testSecret':
      return await testSecret(client_secrets_manager, arn, token)
    case 'finishSecret':
      return await finishSecret(client_secrets_manager, arn, token)
    default:
      throw new Error('Invalid step parameter')
  }
}

async function createSecret(client: AWS.SecretsManager, arn: string, token: string) {
  const crntSecretVal = await client
    .getSecretValue({
      SecretId: arn,
      VersionStage: 'AWSCURRENT',
    })
    .promise()

  Logger.log(`crntSecretVal: ${JSON.stringify(crntSecretVal)}`)
  try {
    await client
      .getSecretValue({
        SecretId: arn,
        VersionStage: 'AWSPENDING',
        VersionId: token,
      })
      .promise()
  } catch (e) {
    if (e.code === 'ResourceNotFoundException') {
      const json = encyptDecrypt(crntSecretVal?.SecretString)
      await client
        .putSecretValue({
          SecretId: arn,
          ClientRequestToken: token,
          SecretString: JSON.stringify(json),
          VersionStages: ['AWSPENDING'],
        })
        .promise()
    } else {
      throw e
    }
  }
}

async function setSecret(
  _client_secrets_manager: AWS.SecretsManager,
  _arn: string,
  _token: string,
) {
  // throw new Error("Not Implemented");
}

async function testSecret(
  _client_secrets_manager: AWS.SecretsManager,
  _arn: string,
  _token: string,
) {
  // throw new Error("Not Implemented")
}

async function finishSecret(client: AWS.SecretsManager, arn: string, token: string) {
  Logger.log(`finish secret:`, token)
  const currentVersion = await client
    .getSecretValue({
      SecretId: arn,
      VersionStage: 'AWSCURRENT',
    })
    .promise()
  Logger.log(`current Version: ${JSON.stringify(currentVersion)}`)

  if (currentVersion.VersionId === token) {
    Logger.log(
      `finishSecret: Version ${currentVersion} already marked as AWSCURRENT for ${arn}`,
    )
    return
  }

  await client
    .updateSecretVersionStage({
      SecretId: arn,
      VersionStage: 'AWSCURRENT',
      MoveToVersionId: token,
      RemoveFromVersionId: currentVersion.VersionId,
    })
    .promise()
  Logger.log('Update done')
  delete cache[currentVersion.Name]
}
