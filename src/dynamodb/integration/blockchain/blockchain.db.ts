import { DB_TABLE_NAME, USER_DB_TABLE_NAME } from '@const/environments'
import { BlockchainSchema } from '@core/schemas/integrations/blockchain/blockchain.schema'
import { AccessPatternMatrix, ValueFor } from '@db/core/dyanamo-access-pattern'
import { Keys } from '@db/core/dynamo-enum'
import { logger } from '@shared/logger/logger'
import { generateUpdateQuery, get, IS_CAMEL_CASE, query, update } from '@utils/index'

export class BlockchainDB {
  blockchainFields: BlockchainSchema

  constructor(BlockchainDetails: BlockchainSchema) {
    this.blockchainFields = BlockchainDetails
  }

  get pk(): string {
    return AccessPatternMatrix().contractDetails.pk.replace(
      ValueFor.reId,
      this.blockchainFields.reId,
    )
  }

  get sk(): string {
    return AccessPatternMatrix().contractDetails.sk.replace(
      ValueFor.order_id,
      this.blockchainFields.orderId,
    )
  }
}

export const saveTokenTransferDetails = async (blockchain: BlockchainSchema) => {
  logger.info(`Blockchain object getting ${JSON.stringify(blockchain)}`)
  const orderInput = {
    tokenTransferredWallet: blockchain.totalNumberOfTokens,
    transactionHash: blockchain.transactionHash,
  }
  const propInput = {
    tokens_remaining_blockchain: blockchain.tokenBal,
  }
  const returnTypeOrder = await generateUpdateQuery(
    { updates: orderInput },
    IS_CAMEL_CASE,
  )
  const returnTypeProp = await generateUpdateQuery(
    { updates: propInput },
    IS_CAMEL_CASE,
  )
  try {
    /**
     * update total token transferred to order row
     */
    return await update(
      {
        TableName: DB_TABLE_NAME,
        Key: {
          [Keys.PK]: AccessPatternMatrix().contractDetails.pk.replace(
            ValueFor.reId,
            blockchain.reId,
          ),
          [Keys.SK]: AccessPatternMatrix().contractDetails.sk.replace(
            ValueFor.order_id,
            blockchain.orderId,
          ),
        },
        ...returnTypeOrder,
        ReturnValues: 'ALL_NEW',
      },
      IS_CAMEL_CASE,
    )
      .then(async data => {
        logger.info('PP attributes : ' + JSON.stringify(data))
        /**
         * update total token transferred to user row
         */
        await update(
          {
            TableName: DB_TABLE_NAME,
            Key: {
              [Keys.PK]: AccessPatternMatrix().contractDetails.pk.replace(
                ValueFor.reId,
                blockchain.reId,
              ),
              [Keys.SK]: AccessPatternMatrix().user.sk.replace(
                ValueFor.userId,
                blockchain.userId,
              ),
            },
            UpdateExpression:
              'SET #token_transferred_wallet = #token_transferred_wallet + :token_transferred_wallet_inc',
            ExpressionAttributeNames: {
              '#token_transferred_wallet': 'token_transferred_wallet',
            },
            ExpressionAttributeValues: {
              ':token_transferred_wallet_inc': blockchain.totalNumberOfTokens,
            },
            ReturnValues: 'ALL_NEW',
          },
          IS_CAMEL_CASE,
        )
          .then(async d => {
            logger.info('Total token transfered in wallet: ' + JSON.stringify(d))
            /**
             * update remaining tokens in prop info
             */
            await update(
              {
                TableName: DB_TABLE_NAME,
                Key: {
                  [Keys.PK]: AccessPatternMatrix().contractDetails.pk.replace(
                    ValueFor.reId,
                    blockchain.reId,
                  ),
                  [Keys.SK]: '#PROP',
                },
                ...returnTypeProp,
                ReturnValues: 'UPDATED_NEW',
              },
              IS_CAMEL_CASE,
            )
              .then(d => {
                logger.info('Remaining tokens for property' + JSON.stringify(d))
              })
              .catch(e => {
                throw e
              })
          })
          .catch(e => {
            throw e
          })
        return { result: 'success' }
      })
      .catch(e => {
        throw e
      })
  } catch (error) {
    throw error
  }
}

export const getIsAddressWhitelistedFromDB = async (
  address: string,
  userId: string,
): Promise<{ result: string }> => {
  try {
    const userPK = AccessPatternMatrix().contractAddressDetails.pk.replace(
      ValueFor.userId,
      userId,
    )

    logger.info(address)
    const param = {
      TableName: USER_DB_TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': userPK,
      },
    }
    const addressdb = await query(param, IS_CAMEL_CASE)
    const oResponse = addressdb[0]
    logger.info(oResponse)
    return { result: 'oResponse' }
  } catch (error) {
    throw error
  }
}

export const getUserInfoById = async userId => {
  return await get(
    {
      TableName: USER_DB_TABLE_NAME,
      Key: {
        [Keys.PK]: AccessPatternMatrix().user.pk.replace(ValueFor.userId, userId),
        [Keys.SK]: AccessPatternMatrix().user.sk.replace(ValueFor.userId, userId),
      },
    },
    IS_CAMEL_CASE,
  )
}

export const getTokenIdFromDB = async reId => {
  return await get(
    {
      TableName: DB_TABLE_NAME,
      Key: {
        [Keys.PK]: AccessPatternMatrix().real_estate_info.pk.replace(
          ValueFor.reId,
          reId,
        ),
        [Keys.SK]: AccessPatternMatrix().real_estate_info.sk,
      },
    },
    IS_CAMEL_CASE,
  )
}
