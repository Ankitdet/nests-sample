import { AppResolver } from '@app/app.resolver'
import { FetchPropertyInput, RealEstateArgs } from '@core/args'
import { MUTATION_METHOD_DECORATOR } from '@core/decorators/mutation.decorator'
import { QUERY_METHOD_DECORATOR } from '@core/decorators/query.decorator'
import { RealEstateListingInput, ReIdInput /* StartKeyInput */ } from '@core/inputs'
import {
  INoPropertFound,
  IRealEstateListing,
  RealEstateInterface,
  RealEstateSmartContract,
} from '@core/interfaces'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorators/current-user.decorator'
import _ from 'lodash'
import { UUIDValidationPipe } from '../../shared/pipe/args.pipe'
import { convertImagesToWebp } from '../s3-buckets/s3utils'
// import { convertImagesToWebp } from '../s3-buckets/s3utils'
import { RealEstateService } from './real-estate.service'

@Resolver()
export class RealEstateResolver extends AppResolver {
  constructor(public readonly realEstateService: RealEstateService) {
    super()
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.realEstateFinance.return,
    MUTATION_METHOD_DECORATOR.realEstateFinance.options,
  )
  async add(@Args() input: RealEstateArgs): Promise<RealEstateInterface> {
    return this.realEstateService.createPropertyFinance(input)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.fetchRealEstateBasicInfo.return,
    MUTATION_METHOD_DECORATOR.fetchRealEstateBasicInfo.options,
  )
  async propertyBasicInfo(
    @Args() input: FetchPropertyInput /* @Context() cxt: any */ /* @Info() info */,
    @CurrentUser() user: any,
  ): Promise<IRealEstateListing | INoPropertFound> {
    const data = await this.realEstateService.createOrSearchProperty(input, user)
    if (data?.['boundary']?.['geojson']) {
      data['boundary']['geojson']['coordinates'] = _.flatMap(
        data?.['boundary']?.geojson?.coordinates,
      )
    }
    return data
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.realEstateBasicInfo.return,
    MUTATION_METHOD_DECORATOR.realEstateBasicInfo.options,
  )
  async createReBasicInfo(
    @Args('input') input: RealEstateListingInput,
    @CurrentUser() user: any,
  ): Promise<IRealEstateListing> {
    input['user_id'] = input?.user_id || user?.['sub']
    return this.realEstateService.createRealEstateBasicInfo(input)
  }

  @Query(
    QUERY_METHOD_DECORATOR.getRealEstateFinanceByReId.return,
    QUERY_METHOD_DECORATOR.getRealEstateFinanceByReId.options,
  )
  async getRealEstateFinanceByReId(
    @Args('input') re_id: ReIdInput,
  ): Promise<RealEstateInterface> {
    return this.realEstateService.getRealEstateFinanceByReId(re_id.re_id)
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.updateSmartContractAndAdditionalInfo.return,
    MUTATION_METHOD_DECORATOR.updateSmartContractAndAdditionalInfo.options,
  )
  async updateSmartContract(
    @Args('re_id') reId: string,
    @Args('tokenId') tokenId: string,
    @Args('tokenSmartContractUrl') tokenSmartContractUrl: string,
    @Args('propertyDescription') propertyDescription: string,
    @Args('additionalPerks') additionalPerks: string,
    @Args('companyName', { nullable: false }) companyName: string,
    @Args('closingDate', { nullable: false }) closingDate: string,
    @Args('offeringMemorandumDate', { nullable: false }) offeringMemorandumDate: string,
    @CurrentUser() _user: any,
  ): Promise<RealEstateSmartContract> {
    return this.realEstateService.updateSmartContract(
      reId,
      tokenId,
      tokenSmartContractUrl,
      propertyDescription,
      additionalPerks,
      companyName,
      closingDate,
      offeringMemorandumDate,
    )
  }

  @Query(
    QUERY_METHOD_DECORATOR.getRealEstateBasicInfoById.return,
    QUERY_METHOD_DECORATOR.getRealEstateBasicInfoById.options,
  )
  async getRealEstateBasicInfoById(
    @Args('re_id', UUIDValidationPipe) re_id: string,
  ): Promise<RealEstateInterface> {
    return this.realEstateService.getRealEstateBasicInfoById(re_id)
  }

  @Query(
    QUERY_METHOD_DECORATOR.getRealEstateInfoListByIds.return,
    QUERY_METHOD_DECORATOR.getRealEstateInfoListByIds.options,
  )
  async getRealEstateInfoListByIds(
    @Args('reIds', {
      name: 'reIds',
      description: 'realestate Ids',
      type: () => [String],
    })
    reIds: [string],
  ): Promise<any> {
    return this.realEstateService.getRealEstateInfoList(reIds)
  }

  @Query(
    QUERY_METHOD_DECORATOR.getRealEstateInfoList.return,
    QUERY_METHOD_DECORATOR.getRealEstateInfoList.options,
  )
  /* async getRealEstateInfoList(
    @Args('nextCursor') nextCursor: StartKeyInput,
    @Args('limit', { nullable: true }) limit: number,
  ): Promise<any> {
    return await this.realEstateService.getRealEstateInfoListWithoutIds({
      limit,
      nextCursor,
    })
  } */
  async getRealEstateInfoList(): Promise<any> {
    return this.realEstateService.getRealEstateInfoListWithoutIds()
  }

  @Query(
    QUERY_METHOD_DECORATOR.getRealEstateInfoById.return,
    QUERY_METHOD_DECORATOR.getRealEstateInfoById.options,
  )
  async getRealEstateInfoById(
    @Args('reId', {
      name: 'reId',
      description: 'realestate Id',
      type: () => String,
    })
    reId: string,
  ): Promise<RealEstateInterface> {
    const reIds: [string] = [reId]
    const resp = await this.realEstateService.getRealEstateInfoList(reIds)
    return resp[0]
  }
  @Mutation(() => String, {
    name: 'compressImages',
  })
  async ankitest(
    @Args('reId', {
      name: 'reId',
      description: 'realestate Id with s3 path',
      type: () => String,
    })
    reId: string,
  ): Promise<any> {
    return await convertImagesToWebp(reId)
  }
}
