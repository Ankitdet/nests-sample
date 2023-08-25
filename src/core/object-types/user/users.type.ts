import { TypeName } from '@core/enums'
import { Role } from '@core/enums/role.enum'
import { Field, ObjectType, OmitType } from '@nestjs/graphql'
import { JSONObject } from '@shared/scalar/json.scalar'
import { AbstractTrue, UUID_VERSION } from '@utils/common.utils'
import { IsUUID } from 'class-validator'

@ObjectType(TypeName.Address, { ...AbstractTrue })
class Address {
  @Field({
    description: 'name of street which user is belong to',
    nullable: true,
  })
  street?: string
  @Field({
    description: 'name of city which user belong to',
    nullable: true,
  })
  city?: string
  @Field({
    description: 'name of country which user belong to',
    nullable: true,
  })
  country?: string
  @Field({
    description: 'name of state which user belong to',
    nullable: true,
  })
  state?: string
  @Field({
    description: 'name of zip which user belong to',
    nullable: true,
  })
  zip?: string
}

/** user Type */
@ObjectType(TypeName.UserType)
export class UserType {
  @Field({ description: 'The unique identifier of the new user', nullable: false })
  _id: string

  @Field({ description: 'The first name of the user', nullable: false })
  firstname: string

  @Field({ description: 'The last name of user', nullable: false })
  lastname: string

  @Field(() => Address, { description: 'The address of the user', nullable: true })
  address?: Address

  @Field(() => [Role], { description: 'The role of user', nullable: true })
  role?: [Role]
}

@ObjectType(TypeName.UserResponse)
export class UserResponse {
  @Field({
    description: 'return deleted object in array',
    nullable: false,
  })
  id: string
  @Field({
    description: 'return deleted object in array',
    nullable: false,
  })
  firstname: string

  @Field({
    description: 'return deleted object in array',
    nullable: false,
  })
  lastname: string

  @Field(() => Address, {
    description: 'return deleted object in array',
    nullable: true,
  })
  address?: Address
}

@ObjectType(TypeName.UserPermission, { ...AbstractTrue })
class UserPermission {
  /*  

   @Field({
     description: 'sell_tokens',
     nullable: true,
   })
   sell_tokens?: boolean

     @Field({
     description: 'buyer_stats',
     nullable: true,
   })
   buyer_stats?: boolean
   @Field({
    description: 'document',
    nullable: true,
  })
  document?: boolean

   @Field({
    description: 're_statistics',
    nullable: true,
  })
  re_statistics?: boolean

  @Field({
    description: 'users',
    nullable: true,
  })
  users?: boolean
  @Field({
    description: 'search_engine',
    nullable: true,
  })
  search_engine?: boolean

  @Field({
    description: 'ppm_doc',
    nullable: true,
  })
  ppm_doc?: boolean

    @Field({
    description: 'orders',
    nullable: true,
  })
  orders?: boolean
  @Field({
    description: 'verify_account',
    nullable: true,
  })
  verify_account?: boolean

   @Field({
    description: 'checkout',
    nullable: true,
  })
  checkout?: boolean

   */
  @Field({
    description: 'blockchain_address',
    nullable: true,
  })
  blockchain_address?: boolean

  @Field({
    description: 'firstname',
    nullable: true,
  })
  firstname?: boolean
  @Field({
    description: 'home',
    nullable: true,
  })
  home?: boolean
  @Field({
    description: 'kyc_status',
    nullable: true,
  })
  kyc_status?: boolean

  @Field({
    description: 'lastname',
    nullable: true,
  })
  lastname?: boolean
  @Field({
    description: 're_listing',
    nullable: true,
  })
  re_listing?: boolean
  @Field({
    description: 'profile',
    nullable: true,
  })
  profile?: boolean
  @Field({
    description: 'marketplace',
    nullable: true,
  })
  marketplace?: boolean
  @Field({
    description: 'password_reset',
    nullable: true,
  })
  password_reset?: boolean
  @Field({
    description: 're_detail',
    nullable: true,
  })
  re_detail?: boolean
}

@ObjectType(TypeName.UserRolePermission, { ...AbstractTrue })
class UserRolePermission {
  @Field(() => [Role], {
    description: 'markertplace permission',
    nullable: false,
  })
  role?: [Role]

  @Field(() => UserPermission, {
    description: 'markertplace permission',
    nullable: false,
  })
  permission?: UserPermission
}

@ObjectType(TypeName.UserAttr, { ...AbstractTrue })
class UserAttr {
  @Field({
    description: 'email of user',
    nullable: true,
  })
  email?: string

  @Field({
    description: 'user\'s firstname',
    nullable: true,
  })
  firstname?: string

  @Field({
    description: 'user\'s lastname',
    nullable: true,
  })
  lastname?: string
}

@ObjectType(TypeName.CreateCognitoUserType)
export class CreateCognitoUserType {
  @Field({
    description: 'user id of user',
    nullable: true,
  })
  @IsUUID(UUID_VERSION)
  user_id: string

  @Field(() => UserAttr, {
    description: 'user attribute',
    nullable: true,
  })
  user: UserAttr

  @Field(() => UserRolePermission, {
    description: 'return user`s permission',
    nullable: true,
  })
  rolePermission?: UserRolePermission
  /* 
    @Field(() => [String], {
      description: 'return user`s permission',
      nullable: true,
    })
    test?: [string] */
}

@ObjectType(TypeName.GetCognitoUserType)
export class GetCognitoUserType extends CreateCognitoUserType {
  @Field({
    description: 'user kyc status',
    nullable: true,
  })
  kyc_completed?: string

  @Field({
    description: 'user whitelist address',
    nullable: true,
  })
  whitelist_address?: string
}

@ObjectType(TypeName.UpdateCognitoUserType)
export class UpdateCognitoUserType extends CreateCognitoUserType {}

@ObjectType(TypeName.ChangeRoleType)
export class ChangeRoleType extends OmitType(CreateCognitoUserType, ['user']) {}

@ObjectType(TypeName.updateEthereumAddressType)
export class UpdateEthereumAddressType {
  @Field({
    description: 'message success or failure.',
    nullable: true,
  })
  message?: string
}

@ObjectType('ScalarObjectType')
export class ScalarObjectType {
  @Field(() => JSONObject, { nullable: true, description: 'testing the scalar type' })
  payload: object
}

@ObjectType('JwtTokenType')
export class JwtTokenType {
  @Field({
    description: 'idToken.',
    nullable: true,
  })
  idToken?: string
  @Field({
    description: 'accessToken.',
    nullable: true,
  })
  accessToken?: string

  @Field({
    description: 'refreshToken',
    nullable: true,
  })
  refreshToken?: string
}

@ObjectType('JwtAccessTokenRefresh')
export class JwtAccessToken {
  @Field({
    description: 'accessToken.',
    nullable: true,
  })
  accessToken?: string

  @Field({
    description: 'idToken.',
    nullable: true,
  })
  idToken?: string
}

@ObjectType(TypeName.PPMDcoumentType)
export class PPMDcoumentType {
  @Field({
    description: 're id',
    nullable: true,
  })
  re_id?: string

  @Field({
    description: 'user id.',
    nullable: true,
  })
  user_id?: string

  @Field({
    description: 'ppmAgreement.',
    nullable: true,
  })
  ppmAgreement?: boolean

  @Field({
    description: 'ppmAgreement timestamp.',
    nullable: true,
  })
  ppmAgreementTimestamp?: string

  @Field({
    description: 'operatingAgreement.',
    nullable: true,
  })
  operatingAgreement: boolean

  @Field({
    description: 'operatingAgreement timestamp.',
    nullable: true,
  })
  operatingAgreementTimestamp: string
}

@ObjectType(TypeName.UserReferralType)
export class UserReferralType {
  @Field({
    description: 'user id.',
    nullable: false,
  })
  user_id?: string

  @Field({
    description: 'referrer code.',
    nullable: true,
  })
  referrerCode: string

  @Field({
    description: 'referre code.',
    nullable: true,
  })
  referralCode: string

  @Field({
    description: 'referral link.',
    nullable: true,
  })
  referralLink: string
}

@ObjectType(TypeName.ApplyReffralCode)
export class ApplyReffralCode extends OmitType(UserReferralType, [
  'referralCode',
  'referralLink',
]) {
  @Field({
    description: 'referrer userId.',
    nullable: true,
  })
  referrerUserId: string
}
