import { ArgsType, Field, Int } from '@nestjs/graphql'
import { UUID_VERSION } from '@utils/common.utils'
import { IsPositive, IsUUID } from 'class-validator'

@ArgsType()
export class RealEstateArgs {
  @Field({
    description: 'id of already created property',
    nullable: false,
  })
  @IsUUID(UUID_VERSION)
  re_id: string

  @Field(() => Int, {
    description: 'platformListFees- percentage field',
  })
  platformListFeesInPercentage: number

  @Field(() => Int, {
    description: 'platformFees- percentage field',
  })
  @IsPositive()
  rentProcessingFees: number

  @Field(() => Int, {
    description: 'propertyMgtFees- percentage field',
  })
  @IsPositive()
  propertyMgmtFees: number

  @Field(() => Int, {
    description: 'maintenanceExpense -percentage field',
  })
  @IsPositive()
  maintenanceExpenseInPercentage: number

  @Field(() => Int, {
    description: 'buying fees',
    nullable: false,
  })
  @IsPositive()
  assetPrice: number

  @Field(() => Int)
  @IsPositive()
  closingCost: number

  @Field(() => Int)
  @IsPositive()
  expectedReserveFunds: number

  @Field(() => Int)
  @IsPositive()
  renovationCosts: number

  // Expenses
  @Field(() => Int)
  @IsPositive()
  propertyTaxes: number

  @Field(() => Int)
  @IsPositive()
  insurance: number

  @Field(() => Int)
  @IsPositive()
  utilities: number

  @Field(() => Int)
  @IsPositive()
  expectedGrossRentPerProperty: number

  constructor(data: Partial<RealEstateArgs>) {
    Object.assign(this, data)
  }
}

@ArgsType()
export class FetchPropertyInput {
  @Field({ nullable: true })
  streetAddress: string
  @Field({ nullable: true })
  city: string
  @Field({ nullable: true })
  state: string
  @Field(() => Int, { nullable: true })
  zipCode?: number

  constructor(data: Partial<FetchPropertyInput>) {
    Object.assign(this, data)
  }
}
