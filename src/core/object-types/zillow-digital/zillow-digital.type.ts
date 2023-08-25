import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { JSONObject } from '@shared/scalar/json.scalar'
import { NullableTrue } from '@utils/common.utils'
import { CommonType } from '../common.type'

@ObjectType()
export class ChartDataType {
  @Field(() => JSONObject, { description: 'price' })
  prices: object
}

@ObjectType()
export class ZillowDataByAddressType {
  @Field(() => JSONObject, { description: 'zillow data.' })
  data: object
}

@ObjectType()
export class ZilloDigitalREDataType {
  @Field(() => JSONObject, { description: 'list zillow data.' })
  data: object
}

@ObjectType()
export class GetMarketCapitalisation {
  @Field(() => JSONObject, { description: 'get market capitialaztion..' })
  data: object
}

@ObjectType()
export class HostListingsType {
  @Field(() => JSONObject, { description: 'list hotlistings.' })
  data: object[]
}

@ObjectType()
export class SocialsData {
  @Field({ ...NullableTrue })
  discord?: string

  @Field({ ...NullableTrue })
  instagram?: string

  @Field({ ...NullableTrue })
  telegram?: string

  @Field({ ...NullableTrue })
  twitter?: string
}

@ObjectType()
export class CompanyData {
  @Field()
  created_at: string

  @Field()
  explorers: string

  @Field()
  reCompany: string

  @Field()
  reCompanyUrl: string

  @Field(() => SocialsData, { description: 'socials' })
  socials: object

  @Field()
  updated_at: string
}

@InputType()
export class SocialsInput {
  @Field({ ...NullableTrue, description: 'twitter' })
  twitter?: string

  @Field({ ...NullableTrue, description: 'discord' })
  discord?: string

  @Field({ ...NullableTrue, description: 'telgram' })
  telegram?: string

  @Field({ ...NullableTrue, description: 'instagram' })
  instagram?: string

  @Field({ ...NullableTrue, description: 'facebook' })
  facebook?: string

  @Field({ ...NullableTrue, description: 'gitbook' })
  gitbook?: string

  @Field({ ...NullableTrue, description: 'github' })
  github?: string

  @Field({ ...NullableTrue, description: 'reddit' })
  reddit?: string
}

@InputType()
export class CompanyInput {
  @Field()
  reCompany: string

  @Field()
  reCompanyUrl: string

  @Field(() => SocialsInput, { nullable: true })
  socials: SocialsInput

  @Field()
  explorers: string
}

@ObjectType()
export class CompanyContractData {
  @Field()
  contractAddr: string
}

@ObjectType('DebtObjectType')
export class DebtInput {
  @Field({ ...NullableTrue })
  debtType: string
  @Field({ ...NullableTrue })
  debtName: string
  @Field({ ...NullableTrue })
  debtSize: string
  @Field({ ...NullableTrue })
  status: string
  @Field({ ...NullableTrue })
  estRoi: string
  @Field({ ...NullableTrue })
  debtTenure: string
  @Field({ ...NullableTrue })
  startDate: string
  @Field({ ...NullableTrue })
  endDate: string
}
@ObjectType('CreateReCompanyType')
export class CreateReCompanyType extends CompanyInput {
  @Field({ nullable: false, description: 'company id.' })
  companyId: string
}

@ObjectType('CreateDigitalDebt')
export class CreateDigitalDebtType {
  @Field({ nullable: false, description: 'company id.' })
  companyName: string

  @Field(() => DebtInput, { nullable: false, description: 'debt inputs' })
  debt: DebtInput
  @Field({ nullable: false, description: 'url of company' })
  url: string
}

@ObjectType('CreateDigitalDebt01')
export class CreateDigitalDebtType01 {
  @Field(() => JSONObject, { nullable: false, description: 'debt inputs' })
  data: JSONObject
}
@ObjectType('createDigitalBondsType')
export class CreateDigitalBondsType {
  @Field(() => JSONObject, { nullable: false, description: 'debt inputs' })
  bonds: JSONObject
}

@ObjectType('createDigitalArtsType')
export class CreateDigitalArtsType {
  @Field(() => JSONObject, { nullable: false, description: 'arts object type.' })
  arts: JSONObject
}

@ObjectType('SocialType')
class SocialType {
  @Field({ ...NullableTrue, description: 'twitter' })
  twitter?: string

  @Field({ ...NullableTrue, description: 'discord' })
  discord?: string

  @Field({ ...NullableTrue, description: 'telgram' })
  telegram?: string

  @Field({ ...NullableTrue, description: 'instagram' })
  instagram?: string

  @Field({ ...NullableTrue, description: 'facebook' })
  facebook?: string

  @Field({ ...NullableTrue, description: 'gitbook' })
  gitbook?: string

  @Field({ ...NullableTrue, description: 'github' })
  github?: string

  @Field({ ...NullableTrue, description: 'reddit' })
  reddit?: string
}

@ObjectType('GetDigitalReCompanyType')
export class GetDigitalReCompanyType extends CommonType {
  @Field({ ...NullableTrue, defaultValue: null })
  reCompany: string

  @Field({ ...NullableTrue, defaultValue: '' })
  reCompanyUrl: string

  @Field(() => SocialType, { ...NullableTrue, defaultValue: {} })
  socials: SocialType

  @Field({ ...NullableTrue, defaultValue: '' })
  explorers: string
}

@ObjectType()
export class HistoricalDataType {
  @Field(() => JSONObject, { nullable: false, description: 'historical' })
  historicalData: JSONObject
}
