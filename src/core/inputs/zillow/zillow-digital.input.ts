import { Field, InputType } from '@nestjs/graphql'
import { NullableFalse } from '@utils/index'

@InputType('DebtObjectInput')
export class DebtInputs {
  @Field({ ...NullableFalse })
  debtType: string
  @Field({ ...NullableFalse })
  debtName: string
  @Field({ ...NullableFalse })
  debtSize: string
  @Field({ ...NullableFalse })
  status: string
  @Field({ ...NullableFalse })
  estRoi: string
  @Field({ ...NullableFalse })
  debtTenure: string
  @Field({ ...NullableFalse })
  startDate: string
  @Field({ ...NullableFalse })
  endDate: string
}

@InputType('CreateDigitalInput')
export class CreateDigitalDebtInput {
  @Field({ nullable: false, description: 'company id.' })
  companyName: string

  @Field(() => DebtInputs, { nullable: false, description: 'debt inputs' })
  debt: DebtInputs
}
