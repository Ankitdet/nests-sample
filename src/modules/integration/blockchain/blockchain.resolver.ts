import { MUTATION_METHOD_DECORATOR } from '@core/decorators/mutation.decorator'
import { QUERY_METHOD_DECORATOR } from '@core/decorators/query.decorator'
import { IBlockchainDetails } from '@core/interfaces'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { logger } from '@shared/logger/logger'
import { BlockchainService } from './blockchain.service'

@Resolver(() => String)
export class BlockchainResolver {
  constructor(public readonly alchemyService: BlockchainService) {}

  @Mutation(
    MUTATION_METHOD_DECORATOR.updateTokenTransfer.return,
    MUTATION_METHOD_DECORATOR.updateTokenTransfer.options,
  )
  async tokenTransfer(
    @Args('totalNumberOfTokens', {
      name: 'totalNumberOfTokens',
      description: 'number of tokens for token distribution',
    })
    totalNumberOfTokens: number,
    @Args('orderId', {
      name: 'orderId',
      description: 'order ID of the purchase',
    })
    orderId: string,
    @Args('reId', {
      name: 'reId',
      description: 'real estate ID of the purchase',
    })
    reId: string,
    @Args('userId', {
      name: 'userId',
      description: 'ID of buyer/user',
    })
    userId: string,
  ): Promise<IBlockchainDetails> {
    logger.info('calling token transfer service')
    // needs to be commented when actual value is passed from UI
    // ethereumAddress = '0x35e4Ef75AfeB0d555DA67229b1118AE448F54b01'
    // numberOftokens = '3'
    // orderId = "#ORDER#06eabe67-7c42-48b4-85f1-c0f4d072b35a";
    // reId = "#RE#d02f5d69-04d7-4a98-bcc2-6042a4eb451b";
    // @Args('ethereumAddress', {
    //   name: 'ethereumAddress',
    //   description: 'ethereum address for token distribution',
    // })
    // ethereumAddress: string,
    return await this.alchemyService.tokenTransfer(
      // ethereumAddress,
      totalNumberOfTokens,
      orderId,
      reId,
      userId,
    )
  }

  @Query(
    QUERY_METHOD_DECORATOR.whitelistAddresses.return,
    QUERY_METHOD_DECORATOR.whitelistAddresses.options,
  )
  async whitelistAddresses(
    @Args('addresses', {
      name: 'addresses',
      description: 'addresses to be whitelisted',
    })
    addresses: string,
  ): Promise<{ result: string }> {
    logger.info('calling whitelisting of addresses')
    // addresses = '0x35e4Ef75AfeB0d555DA67229b1118AE448F54b01'
    const result = await this.alchemyService.whitelistAddresses(addresses)
    logger.info(result)
    return result
  }

  @Query(
    QUERY_METHOD_DECORATOR.isAddressWhitelisted.return,
    QUERY_METHOD_DECORATOR.isAddressWhitelisted.options,
  )
  async isAddressWhitelisted(
    @Args('addresses', {
      name: 'addresses',
      description: 'is address whitelisted',
    })
    addresses: string,
  ): Promise<{ result: string }> {
    logger.info('calling whitelisting of addresses')
    // addresses = '0x35e4Ef75AfeB0d555DA67229b1118AE448F54b01'
    const result = await this.alchemyService.getIsAddressWhitelisted(addresses)
    return result
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.mintingAddressAndSettingUri.return,
    MUTATION_METHOD_DECORATOR.mintingAddressAndSettingUri.options,
  )
  async mintingAddressAndSettingUri(
    @Args('tokenId') tokenId: number,
    @Args('uri') uri: string,
    @Args('re_id') re_id: string,
    @Args('tokenNumberOfTokens') tokenNumberOfTokens: number,
  ): Promise<string> {
    return await this.alchemyService.mintingAddressAndSettingUri(
      tokenId,
      uri,
      re_id,
      tokenNumberOfTokens,
    )
  }
}
