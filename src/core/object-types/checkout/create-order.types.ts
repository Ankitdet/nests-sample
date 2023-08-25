import { TypeName } from '@core/enums'
import { Field, Float, ObjectType, PickType } from '@nestjs/graphql'
import { NullableFalse, NullableTrue, UUID_VERSION } from '@utils/common.utils'
import { IsUUID } from 'class-validator'

@ObjectType(TypeName.OrderType)
export class OrderType {
  @Field({
    ...NullableFalse,
    description: `The user's id`,
  })
  @IsUUID(UUID_VERSION)
  user_id: string
  @Field({
    ...NullableFalse,
    description: 'The order id',
  })
  order_id: string
  @Field({
    ...NullableFalse,
    description: 'The real estate id',
  })
  re_id: string
  @Field({
    ...NullableFalse,
    description: 'The price of the real estate token.',
  })
  token_price: number
  @Field({
    ...NullableFalse,
    description: 'The quantity of tokens.',
  })
  number_of_tokens: number
  @Field({
    ...NullableFalse,
    description: 'The amount for the order to be paid by customer.',
  })
  total_sum: number
  @Field({
    ...NullableFalse,
    description: 'The order status.',
  })
  status: string
  @Field({
    ...NullableFalse,
    description: 'The payment type used.',
  })
  payment_type: string
}

@ObjectType(TypeName.BuyTokesType)
export class BuyTokensType extends PickType(OrderType, [
  're_id',
  'user_id',
  'order_id',
] as const) {}

@ObjectType(TypeName.UpdateAgreementType)
export class UpdateAgreementType extends PickType(OrderType, ['order_id'] as const) {
  @Field({
    ...NullableFalse,
    description: 'subscription document timestamp',
  })
  subscriptionDocTimestamp: string

  @Field({
    ...NullableFalse,
    description: 'operating document timestamp',
  })
  operatingDocTimestamp: string
}

@ObjectType(TypeName.UpdateAgreementType)
export class SubscriptionAgreementType extends PickType(OrderType, [
  're_id',
  'user_id',
] as const) {
  @Field({
    ...NullableTrue,
    description: 'subscription accepted or not',
  })
  subscriptionAccepted: boolean

  @Field({
    ...NullableTrue,
    description: 'operating document timestamp',
  })
  subscriptionTimestamp: string

  @Field({
    ...NullableTrue,
    description: 'auto generated subscription id',
  })
  subscriptionId: string

  @Field(() => Float, { ...NullableTrue, description: 'Number of tokens.' })
  totalNumberOfTokens: number

  @Field(() => Float, { ...NullableTrue, description: 'token price' })
  tokenPrice: number

  @Field(() => Float, { ...NullableTrue, description: 'tokens in this order' })
  tokensInThisOrder: number

  @Field(() => Float, {
    ...NullableTrue,
    description: 'total amount price * tokeninthis order.',
  })
  amount: number
}
