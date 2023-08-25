import { registerEnumType } from '@nestjs/graphql'

export enum Role {
  Admin = 'ADMIN',
  Buyer = 'BUYER',
  Seller = 'SELLER',
  PropertyManager = 'PM',
  Visitor = 'VISITOR',
}

export const RoleArray = [
  Role.Admin,
  Role.Buyer,
  Role.PropertyManager,
  Role.Seller,
  Role.Visitor,
]

registerEnumType(Role, {
  name: 'RoleEnum',
  description: 'Role of the user',
})

export enum PaymentType {
  Coinify = 'COINIFY',
  Bitpay = 'BITPAY',
  Stripe = 'STRIPE',
}

registerEnumType(PaymentType, {
  name: 'PaymentTypeEnum',
  description: 'type of payments.',
})

export enum TransactionStatus {
  InProgess = 'Inprogress',
  Failed = 'Failed',
  Success = 'Success',
}
