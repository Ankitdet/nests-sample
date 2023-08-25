import * as AWS from 'aws-sdk'
import { SecretVersionsToStagesMapType } from 'aws-sdk/clients/secretsmanager'
import { LogInfo } from '..'

export async function create_secret(
  client_secrets_manager: AWS.SecretsManager,
  arn: string,
  token: string,
) {
  const params = {
    PasswordLength: 32,
    ExcludePunctuation: true,
  }

  const data = await client_secrets_manager.getRandomPassword(params).promise()
  const password = data.RandomPassword

  LogInfo('RETRIEVED RANDOM PASSWORD')
  LogInfo(data)

  const data1 = await client_secrets_manager
    .getSecretValue({
      SecretId: arn,
      VersionStage: 'AWSCURRENT',
    })
    .promise()

  const current_dict = JSON.parse(data1['SecretString'])
  LogInfo('RETRIEVED CURRENT SECRET')
  LogInfo(data1)

  let data12 = null
  try {
    data12 = await client_secrets_manager
      .getSecretValue({
        SecretId: arn,
        VersionId: token,
        VersionStage: 'AWSPENDING',
      })
      .promise()
  } catch (e) {
    // switch the ACTIVE/PASSIVE usernames around for the new secret
    const username = current_dict['username'] === 'app' ? 'app_clone' : 'app'

    // we'll need to store the masterarn and ipaddress as well for future rotations
    const new_secret = {
      username,
      password,
      masterarn: current_dict['masterarn'],
      ipaddress: current_dict['ipaddress'],
    }

    const data2 = await client_secrets_manager
      .putSecretValue({
        SecretId: arn,
        SecretString: JSON.stringify(new_secret),
        VersionStages: ['AWSPENDING'],
        ClientRequestToken: token,
      })
      .promise()

    LogInfo('PUT PENDING SECRET')
    LogInfo(data2)
  }
  LogInfo(data12)
}

export async function set_secret(
  _client_secrets_manager: AWS.SecretsManager,
  _arn: string,
) {
  /*  let params = {
     SecretId: arn,
     VersionStage: 'AWSPENDING',
   }
 
   let data = await client_secrets_manager.getSecretValue(params).promise()
   const pending_dict = JSON.parse(data['SecretString'])
 
   LogInfo('RETRIEVED PENDING SECRET')
   LogInfo(data)
 
   params = {
     SecretId: pending_dict['masterarn'],
     VersionStage: 'AWSCURRENT',
   }
 
   data = await client_secrets_manager.getSecretValue(params).promise()
   const master_dict = JSON.parse(data['SecretString'])
 
   LogInfo('RETRIEVED MASTER SECRET')
   LogInfo(data, master_dict) */
  /* client.connect(`mongodb://${master_dict['username']}:${master_dict['password']}@${pending_dict['ipaddress']}:27017`, (err, client) => {

        const db = client.db('admin');

        db.command({
            updateUser: pending_dict['username'],
            pwd: pending_dict['password']
        }, (err, res) => {
            LogInfo('CHANGED PASSWORD IN MONGODB');
            LogInfo(res);
        });

        client.close();
    }); */
}

export async function test_secret(
  _client_secrets_manager: AWS.SecretsManager,
  _arn: string,
) {
  /*  const data = await client_secrets_manager
     .getSecretValue({
       SecretId: arn,
       VersionStage: 'AWSPENDING',
     })
     .promise()
   const pending_dict = JSON.parse(data['SecretString'])
 
   LogInfo('RETRIEVED PENDING SECRET')
   LogInfo(data, pending_dict) */
  /*    client.connect(`mongodb://${pending_dict['username']}:${pending_dict['password']}@${pending_dict['ipaddress']}:27017`, (err, client) => {
           LogInfo('TEST OK');
           client.close();
       }); */
}

export async function finish_secret(
  client_secrets_manager: AWS.SecretsManager,
  arn: string,
  token: string,
) {
  const params = {
    SecretId: arn,
    VersionStage: 'AWSCURRENT',
  }

  const metadata = await client_secrets_manager.describeSecret(params).promise()
  LogInfo('metadata', metadata)
  LogInfo('roken', token)
  for (const version in metadata['VersionIdsToStages']) {
    const jsonObj: SecretVersionsToStagesMapType = metadata.VersionIdsToStages
    LogInfo('version:', version)
    LogInfo('jsonObj:', jsonObj)
    const versions = jsonObj[version]
    for (const v of versions) {
      if (v === 'AWSCURRENT') {
        if (version === token) {
          continue
        }
        const data = await client_secrets_manager
          .updateSecretVersionStage({
            SecretId: arn,
            VersionStage: 'AWSCURRENT',
            MoveToVersionId: token,
            RemoveFromVersionId: version,
          })
          .promise()

        LogInfo('PROMOTED PENDING SECRET TO CURRENT')
        LogInfo(data)
      }
    }
  }
}

/*

import * as AWS from 'aws-sdk'
import { LogInfo } from '..'

export async function create_secret(
  client_secrets_manager: AWS.SecretsManager,
  arn: string,
  token: string,
) {
  const params = {
    PasswordLength: 32,
    ExcludePunctuation: true,
  }

  const data = await client_secrets_manager.getRandomPassword(params).promise()
  const password = data.RandomPassword

  LogInfo('RETRIEVED RANDOM PASSWORD')
  LogInfo(data)

  const data1 = await client_secrets_manager
    .getSecretValue({
      SecretId: arn,
      VersionStage: 'AWSCURRENT',
    })
    .promise()

  const current_dict = JSON.parse(data1['SecretString'])
  LogInfo('RETRIEVED CURRENT SECRET')
  LogInfo(data1)

  // switch the ACTIVE/PASSIVE usernames around for the new secret
  const username = current_dict['username'] === 'app' ? 'app_clone' : 'app'

  // we'll need to store the masterarn and ipaddress as well for future rotations
  const new_secret = {
    username,
    password,
    masterarn: current_dict['masterarn'],
    ipaddress: current_dict['ipaddress'],
  }

  const data2 = await client_secrets_manager
    .putSecretValue({
      SecretId: arn,
      SecretString: JSON.stringify(new_secret),
      VersionStages: ['AWSPENDING'],
      ClientRequestToken: token,
    })
    .promise()

  LogInfo('PUT PENDING SECRET')
  LogInfo(data2)
}

export async function set_secret(
  client_secrets_manager: AWS.SecretsManager,
  arn: string,
) {
  let params = {
    SecretId: arn,
    VersionStage: 'AWSPENDING',
  }

  let data = await client_secrets_manager.getSecretValue(params).promise()
  const pending_dict = JSON.parse(data['SecretString'])

  LogInfo('RETRIEVED PENDING SECRET')
  LogInfo(data)

  params = {
    SecretId: pending_dict['masterarn'],
    VersionStage: 'AWSCURRENT',
  }

  data = await client_secrets_manager.getSecretValue(params).promise()
  const master_dict = JSON.parse(data['SecretString'])

  LogInfo('RETRIEVED MASTER SECRET')
  LogInfo(data, master_dict)

  client.connect(`mongodb://${master_dict['username']}:${master_dict['password']}@${pending_dict['ipaddress']}:27017`, (err, client) => {

        const db = client.db('admin');

        db.command({
            updateUser: pending_dict['username'],
            pwd: pending_dict['password']
        }, (err, res) => {
            LogInfo('CHANGED PASSWORD IN MONGODB');
            LogInfo(res);
        });

        client.close();
    });
}

export async function test_secret(
  client_secrets_manager: AWS.SecretsManager,
  arn: string,
) {
  const data = await client_secrets_manager
    .getSecretValue({
      SecretId: arn,
      VersionStage: 'AWSPENDING',
    })
    .promise()
  const pending_dict = JSON.parse(data['SecretString'])

  LogInfo('RETRIEVED PENDING SECRET')
  LogInfo(data, pending_dict)

  client.connect(`mongodb://${pending_dict['username']}:${pending_dict['password']}@${pending_dict['ipaddress']}:27017`, (err, client) => {
           LogInfo('TEST OK');
           client.close();
       });
}

export async function finish_secret(
  client_secrets_manager: AWS.SecretsManager,
  arn: string,
  token: string,
) {
  const params = {
    SecretId: arn,
    VersionStage: 'AWSCURRENT',
  }

  let data = await client_secrets_manager.getSecretValue(params).promise()
  const version_id = data['VersionId']

  LogInfo('RETRIEVED CURRENT SECRET')
  LogInfo(data)

  data = await client_secrets_manager
    .updateSecretVersionStage({
      SecretId: arn,
      VersionStage: 'AWSCURRENT',
      MoveToVersionId: token,
      RemoveFromVersionId: version_id,
    })
    .promise()

  LogInfo('PROMOTED PENDING SECRET TO CURRENT')
  LogInfo(data)
}
*/
