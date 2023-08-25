import {
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_RINKEBY_TESTNET_NAME,
  CONTRACT_OWNER_ADDRESS,
  METAMASK_PRIVATE_KEY,
  SMART_CONTRACT_ADDRESS,
  STAGE,
} from '@const/environments'
import { Environments } from '@core/enums'
import { IBlockchainDetails } from '@core/interfaces'
import { RealEstateSchema, UserDBSchema } from '@core/schemas'
import { BlockchainSchema } from '@core/schemas/integrations/blockchain/blockchain.schema'
import {
  getUserInfoById,
  saveTokenTransferDetails,
} from '@db/integration/blockchain/blockchain.db'
import { getRealEstateByReId } from '@db/real-estate/real-estate.db'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { axiosGet, BaseHttpService } from '@shared/base.http.service'
import { logger } from '@shared/logger/logger'
import { getContract } from '@utils/blockchain/blockchain.util'
import { ethers } from 'ethers'

const contract = getContract()
@Injectable()
export class BlockchainService extends BaseHttpService {
  constructor(protected httpService: HttpService) {
    super(httpService)
  }
  async tokenTransfer(
    totalNumberOfTokens: number,
    orderId: string,
    reId: string,
    userId: string,
  ): Promise<IBlockchainDetails> {
    let obj: IBlockchainDetails = { result: null }
    try {
      const userData: UserDBSchema = await getUserInfoById(userId)
      const ethereumAddressdb = userData?.whitelistAddress

      const reData: RealEstateSchema = await getRealEstateByReId({ re_id: reId })
      if (!reData?.tokenId) {
        obj = {
          result: `No token Id found for the property `,
        }
        return obj
      }
      logger.info(
        `ethereumAddressdb : ${ethereumAddressdb} & tokenId : ${reData?.tokenId}`,
      )
      if (ethereumAddressdb) {
        logger.info('after ether contract checking..')
        let tx = null
        try {
          if (STAGE === Environments.DEV) {
            const contractObj = await this.getAlchemyContract()
            tx = await contractObj.safeTransferFrom(
              CONTRACT_OWNER_ADDRESS,
              ethereumAddressdb,
              reData?.tokenId,
              totalNumberOfTokens,
              0x0,
            )
          } else {
            const contractObj = await this.getContract()
            const { maxFeePerGas, maxPriorityFeePerGas } = await this.getGasPrice()
            tx = await contractObj.safeTransferFrom(
              CONTRACT_OWNER_ADDRESS,
              ethereumAddressdb,
              reData?.tokenId,
              totalNumberOfTokens,
              0x0,
              {
                maxFeePerGas,
                maxPriorityFeePerGas,
              },
            )
          }
          logger.info('safe transfer from function successfully completed.')
        } catch (e) {
          logger.error(`Error while safeTransferFrom ${JSON.stringify(e)}`)
          throw e
        }
        const receipt = await tx.wait()
        if (receipt?.status === 1) {
          /*
           * Check token balance
           */
          const tokenBal = await this.getTokenBalance(reData?.tokenId)
          /*
           * DB Insert
           */
          const dbStatus = await this.saveTokenTransferDetails(
            receipt,
            totalNumberOfTokens,
            reId,
            orderId,
            userId,
            tokenBal,
          )
          if (dbStatus?.result === 'success') {
            obj = {
              result: 'Token Transfered Successfully',
            }
          } else {
            obj = {
              result: dbStatus.result,
            }
          }
        } else {
          obj = {
            result: 'Token Transfer failed',
          }
        }
      } else {
        obj = {
          result: 'No ethereum address for the user',
        }
      }
    } catch (e) {
      logger.error(`Error in tokenTransfer function.${JSON.stringify(e)}`)
      throw e
    }
    return obj
  }

  async mintingAddressAndSettingUri(
    tokenId: number,
    uri: string,
    re_id: string /* not using */,
    tokenNumberOfTokens: number,
  ): Promise<string> {
    logger.info(`re_id ${re_id}`)
    try {
      // Minting the tokens
      let tx = null
      let tx1 = null
      if (STAGE === Environments.DEV) {
        const contractObj = await this.getAlchemyContract()
        tx = await contractObj.mint(
          CONTRACT_OWNER_ADDRESS,
          tokenId,
          tokenNumberOfTokens,
          0x0,
        )
        logger.info(`Minting ${JSON.stringify(tx)}`)
        tx1 = await contractObj.setURI(tokenId, uri)
      } else {
        const contractObj = await this.getContract()
        const { maxFeePerGas, maxPriorityFeePerGas } = await this.getGasPrice()
        tx = await contractObj.mint(
          CONTRACT_OWNER_ADDRESS,
          tokenId,
          tokenNumberOfTokens,
          0x0,
          { maxFeePerGas, maxPriorityFeePerGas },
        )
        logger.info(`Minting ${JSON.stringify(tx)}`)
        tx1 = await contractObj.setURI(tokenId, uri, {
          maxFeePerGas,
          maxPriorityFeePerGas,
        })
      }
      logger.info(JSON.stringify(tx1))
    } catch (e) {
      logger.error(`Error while safeTransferFrom ${JSON.stringify(e)}`)
      throw e
    }
    return 'minted and set uri done'
  }

  public async getIsAddressWhitelisted(addresses: string): Promise<{ result: string }> {
    if (addresses.length > 0) {
      let status = null
      if (STAGE === Environments.DEV) {
        const contractObj = await this.getAlchemyContract()
        status = await contractObj.isWhitelisted(addresses)
      } else {
        const contractObj = await this.getContract()
        const { maxFeePerGas, maxPriorityFeePerGas } = await this.getGasPrice()
        status = await contractObj.isWhitelisted(addresses, {
          maxFeePerGas,
          maxPriorityFeePerGas,
        })
      }
      logger.info('PP is wh?' + status)
      const msg = status
        ? 'The Address is Whitelisted.'
        : 'The Address is not whitelisted.'

      return { result: msg }
    }
  }

  public async whitelistAddresses(addresses: string): Promise<{ result: string }> {
    try {
      if (addresses.length > 0) {
        let txw = null
        if (STAGE === Environments.DEV) {
          const contractObj = await this.getAlchemyContract()
          txw = await contractObj.addtowh(addresses)
        } else {
          const contractObj = await this.getContract()
          const { maxFeePerGas, maxPriorityFeePerGas } = await this.getGasPrice()
          txw = await contractObj.addtowh(addresses, {
            maxFeePerGas,
            maxPriorityFeePerGas,
          })
        }
        const status = await txw.wait()
        logger.info(status)
        const result = {
          result: status ? 'Whitelisting Successful' : 'Whitelisting Failed',
        }
        return result
      }
    } catch (e) {
      logger.error(
        'Provided Polygon Blockchain Wallet Address is not correct, please enter the correct address',
      )
      return {
        result:
          'Provided Polygon Blockchain Wallet Address is not correct, please enter the correct address',
      }
    }
  }
  public async saveTokenTransferDetails(
    receipt: any,
    totalNumberOfTokens: number,
    reId: string,
    orderId: string,
    userId: string,
    tokenBal: any,
  ) {
    const transactionDetails = {} as BlockchainSchema
    transactionDetails.orderId = orderId
    transactionDetails.reId = reId
    transactionDetails.userId = userId
    transactionDetails.totalNumberOfTokens = totalNumberOfTokens
    transactionDetails.transactionHash = receipt.transactionHash
    transactionDetails.tokenBal = tokenBal

    logger.info(`SaveTokenTransferDetails receipt: ${receipt} `)
    logger.info(`SaveTokenTransferDetails userID: ${userId} `)
    return await saveTokenTransferDetails(transactionDetails)
  }

  public async getTokenBalance(tokenId: any) {
    try {
      let tx = null
      if (STAGE === Environments.DEV) {
        const contractObj = await this.getAlchemyContract()
        tx = await contractObj.balanceOfBatch([CONTRACT_OWNER_ADDRESS], [tokenId])
      } else {
        const contractObj = await this.getContract()
        tx = await contractObj.balanceOfBatch([CONTRACT_OWNER_ADDRESS], [tokenId])
      }
      logger.info(`token balance: ${JSON.stringify(tx)} `)
      const result = parseInt(tx[0]?._hex, 16)
      return result
    } catch (e) {
      logger.error(`Error while performing the getTokenBalance ${JSON.stringify(e)} `)
      throw e
    }
  }

  // This method created only for the DEV env.
  private async getAlchemyContract(): Promise<ethers.Contract> {
    const alchemyProvider = new ethers.providers.AlchemyProvider(
      ALCHEMY_RINKEBY_TESTNET_NAME,
      ALCHEMY_RINKEBY_API_KEY,
    )
    const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, alchemyProvider)
    const contractObj = new ethers.Contract(
      SMART_CONTRACT_ADDRESS,
      contract.abi,
      signer,
    )
    return contractObj
  }

  // This method created only for the STG and PRD env.
  private async getContract(): Promise<ethers.Contract> {
    const infuraProvide = new ethers.providers.InfuraProvider(
      ALCHEMY_RINKEBY_TESTNET_NAME,
      ALCHEMY_RINKEBY_API_KEY,
    )
    const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, infuraProvide)
    const contractObj = new ethers.Contract(
      SMART_CONTRACT_ADDRESS,
      contract.abi,
      signer,
    )
    return contractObj
  }

  private async getGasPrice(): Promise<any> {
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    try {
      const data = await axiosGet('https://gasstation-mainnet.matic.network/v2')
      maxFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxFee) + '', 'gwei')
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + '',
        'gwei',
      )
    } catch (e) {
      logger.error(`Error while getting the gasprice ${JSON.stringify(e)}`)
    }
    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  }
}
