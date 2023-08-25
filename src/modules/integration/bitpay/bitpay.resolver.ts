import { MUTATION_METHOD_DECORATOR } from '@core/decorators/mutation.decorator'
import { CreateInvoiceInput } from '@core/inputs'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorators/current-user.decorator'
import { BitpayService } from './bitpay.service'

@Resolver(() => String)
export class BitpayResolver {
  constructor(public readonly bitpayService: BitpayService) {}

  // change method and all
  @Mutation(
    MUTATION_METHOD_DECORATOR.test.return,
    MUTATION_METHOD_DECORATOR.test.options,
  )
  async testJson(): Promise<any> {
    return {
      payload: {
        test: 1,
        chintan: 'kukdiya',
        ios: 'esop',
      },
    }
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.createInvoice.return,
    MUTATION_METHOD_DECORATOR.createInvoice.options,
  )
  async createInvoice(
    @Args('input', { description: 'input for creating payment intent' })
    input: CreateInvoiceInput,
    @CurrentUser() user: any,
  ): Promise<string> {
    input['user_id'] = input?.user_id || user?.['sub']
    return await this.bitpayService.createInvoice(input)
  }
}
