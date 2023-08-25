import { MUTATION_METHOD_DECORATOR } from '@core/decorators/mutation.decorator'
import { CreatePaymentInput } from '@core/inputs'
import { CoinifyPaymentResponse } from '@core/interfaces'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorators/current-user.decorator'
import { HostName } from '@shared/decorators/hostname.decorator'
import { CoinifyService } from './coinify.service'

@Resolver()
export class CoinifyResolver {
  constructor(private readonly coinifyService: CoinifyService) {}

  @Mutation(
    MUTATION_METHOD_DECORATOR.createCoinifyPayment.return,
    MUTATION_METHOD_DECORATOR.createCoinifyPayment.options,
  )
  async createCoinifyPayment(
    @Args('input', { description: 'input for creating coinify payment' })
    input: CreatePaymentInput,
    @CurrentUser() user: any,
    @HostName() hostname: any,
  ): Promise<CoinifyPaymentResponse> {
    input['user_id'] = input?.user_id || user?.['sub']
    input['hostname'] = hostname
    return this.coinifyService.createCoinifyPayment(input)
  }
}
