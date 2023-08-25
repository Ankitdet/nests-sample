import { AppResolver } from '@app/app.resolver'
import { QUERY_METHOD_DECORATOR } from '@core/decorators/query.decorator'
import { IAddressSanctioned } from '@core/interfaces'
import { AddressSanctioned } from '@core/object-types'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { ChainalysisService } from './chainalysis.service'

@Resolver((_of: any) => AddressSanctioned)
export class ChainalysisResolver extends AppResolver {
  constructor(public readonly realEstateService: ChainalysisService) {
    super()
  }
  @Query(
    QUERY_METHOD_DECORATOR.addressSanctioned.return,
    QUERY_METHOD_DECORATOR.addressSanctioned.options,
  )
  async getAddressSanctioned(
    @Args('address', { name: 'address', description: 'applicant id onfido' })
    address: string,
  ): Promise<IAddressSanctioned> {
    return await this.realEstateService.getAddressSanctioned(address)
  }
}
