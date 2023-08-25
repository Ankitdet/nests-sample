import { Resolver } from '@nestjs/graphql'

@Resolver()
export class CheckoutResolver {
  constructor() {
    // empty
  }

  /* @Mutation(
    MUTATION_METHOD_DECORATOR.buyTokens.return,
    MUTATION_METHOD_DECORATOR.buyTokens.options,
  )
  async createCoinifyPayment(
    @Args('re_id', { name: 're_id', description: 're id' }, UUIDValidationPipe)
    re_id: string,

    @Args('user_id', { name: 'user_id', description: 'user id' }, UUIDValidationPipe)
    user_id: string,
  ): Promise<any> {
    return this.checkoutService.buyTokens(re_id, user_id)
  } */

  /* @Mutation(
    MUTATION_METHOD_DECORATOR.updateOperatingOrSubscriptionAgreement.return,
    MUTATION_METHOD_DECORATOR.updateOperatingOrSubscriptionAgreement.options,
  )
  async updateOperatingOrSubscriptionAgreement(
    @Args(
      'order_id',
      { name: 'order_id', description: 'order id', nullable: false },
      UUIDValidationPipe,
    )
    order_id: string,
    @Args('subscriptionDocTimestamp', {
      name: 'subscriptionDocTimestamp',
      description: 'subscription document timestamp',
      nullable: true,
    })
    subscriptionDocTimestamp: string,
    @Args('operatingDocTimestamp', {
      name: 'operatingDocTimestamp',
      description: 'operating document timestamp',
      nullable: true,
    })
    operatingDocTimestamp: string,
  ): Promise<any> {
    return this.checkoutService.updateOperatingOrSubscriptionAgreement(
      order_id,
      subscriptionDocTimestamp,
      operatingDocTimestamp,
    )
  } */
}
