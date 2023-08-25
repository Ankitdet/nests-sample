import { AppResolver } from '@app/app.resolver'
import { MUTATION_METHOD_DECORATOR } from '@core/decorators/mutation.decorator'
import { CreatePaymentInput } from '@core/inputs'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@shared/decorators/current-user.decorator'
import { HostName } from '@shared/decorators/hostname.decorator'
import { logger } from '@shared/logger/logger'
import { StripeService } from './stripe.service'

@Resolver(() => String)
export class StripeResolver extends AppResolver {
  constructor(public readonly stripeService: StripeService) {
    super()
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.createStripePaymentIntent.return,
    MUTATION_METHOD_DECORATOR.createStripePaymentIntent.options,
  )
  async createStripePaymentIntent(
    @Args('input', { description: 'inputs for creating payment intent' })
    input: CreatePaymentInput,
    @CurrentUser() user: any,
    @HostName() hostname: any,
  ) {
    input['user_id'] = input?.user_id || user?.['sub']
    input['hostname'] = hostname
    logger.info('Calling createPaymentIntent method')
    const paymentIntent = await this.stripeService.createStripePaymentIntent(input)
    return {
      checkoutUrl: paymentIntent.url,
      ...paymentIntent,
    }
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.cancelStripePaymentIntent.return,
    MUTATION_METHOD_DECORATOR.cancelStripePaymentIntent.options,
  )
  async cancelStripePaymentIntent(
    @Args('id', { description: 'stripe id from the url' }) id: string,
  ) {
    logger.info('Calling cancelPayment method')
    return await this.stripeService.cancleStripePaymentIntent(id)
  }
}
