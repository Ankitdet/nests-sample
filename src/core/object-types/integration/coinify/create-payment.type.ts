import { TypeName } from '@core/enums'
import { Field, Float, ObjectType } from '@nestjs/graphql'
import { AbstractTrue, NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.BitCoinType, { ...AbstractTrue })
class BitCoin {
  @Field(() => Float, {
    ...NullableTrue,
    description: 'amount',
  })
  amount: number
  @Field({
    ...NullableTrue,
    description: 'address',
  })
  address: string
  @Field(() => Float, {
    ...NullableTrue,
    description: 'amount_paid',
  })
  amount_paid: number

  @Field(() => Float, {
    ...NullableTrue,
    description: 'amount_due',
  })
  amount_due: number

  @Field({
    ...NullableTrue,
    description: 'payment_uri',
  })
  payment_uri: string
}
@ObjectType(TypeName.NativeType, { ...AbstractTrue })
class NativeType {
  @Field(() => Float, {
    ...NullableTrue,
    description: 'amount',
  })
  amount: number
  @Field({
    ...NullableTrue,
    description: 'currency',
  })
  currency: string
}

@ObjectType(TypeName.TransferType, { ...AbstractTrue })
class TransferType {
  @Field(() => Float, {
    ...NullableTrue,
    description: 'amount',
  })
  amount: number
  @Field({
    ...NullableTrue,
    description: 'currency',
  })
  currency: string
}
@ObjectType(TypeName.CustomType, { ...AbstractTrue })
export class Custom {
  @Field({
    ...NullableTrue,
    description: 're_id',
  })
  re_id: string
  @Field({
    ...NullableTrue,
    description: 'user_id',
  })
  user_id: string
  @Field({
    ...NullableTrue,
    description: 'order_id',
  })
  order_id: string
}
@ObjectType(TypeName.PaymentDataType, { ...AbstractTrue })
class Data {
  @Field({
    ...NullableTrue,
    description: 'id',
  })
  id: number

  @Field({
    ...NullableTrue,
    description: 'uuid',
  })
  uuid: string

  @Field({
    ...NullableTrue,
    description: 'create_time',
  })
  create_time: string

  @Field({
    ...NullableTrue,
    description: 'expire_time',
  })
  expire_time: string

  @Field({
    ...NullableTrue,
    description: 'state',
  })
  state: string

  @Field({
    ...NullableTrue,
    description: 'type',
  })
  type: string

  @Field(() => BitCoin, {
    ...NullableTrue,
    description: 'bitcoin',
  })
  bitcoin: BitCoin

  @Field(() => NativeType, {
    ...NullableTrue,
    description: 'native',
  })
  native: NativeType

  @Field(() => TransferType, {
    ...NullableTrue,
    description: 'native',
  })
  transfer: TransferType

  @Field({
    ...NullableTrue,
    description: 'native',
  })
  description: string
  @Field(() => Custom, {
    ...NullableTrue,
    description: 'custom',
  })
  custom: Custom

  @Field({
    ...NullableTrue,
    description: 'native',
  })
  payment_url: string

  @Field({
    ...NullableTrue,
    description: 'native',
  })
  callback_url: string

  @Field({
    ...NullableTrue,
    description: 'native',
  })
  callback_email: string

  @Field({
    ...NullableTrue,
    description: 'native',
  })
  return_url: string

  @Field({
    ...NullableTrue,
    description: 'native',
  })
  cancel_url: string
}
@ObjectType(TypeName.PaymentType)
export class PaymentType {
  @Field({
    ...NullableTrue,
    description: 'success or failure.',
  })
  success?: boolean

  @Field(() => Data, {
    ...NullableTrue,
    description: 'data object return by payment process.',
  })
  data: Data
}
