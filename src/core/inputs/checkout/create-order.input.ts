import { getInputName, InputName } from '@core/enums'
import { ArgsType, Field, Float, InputType } from '@nestjs/graphql'
import { IsNumber, IsString } from 'class-validator'

@InputType(getInputName(InputName.CreateOrderInput))
@ArgsType()
export class CreateOrderInput {
  @Field(() => Float, {
    description: 'The price of per token in USD',
    nullable: false,
  })
  @IsNumber()
  tokenPrice: number

  @Field(() => Float, {
    description: 'selected token for this order.',
    nullable: false,
  })
  @IsNumber()
  tokensInThisOrder: number

  @Field({
    description: 'return or failure url for coinify or stripe',
    nullable: false,
  })
  @IsString()
  returnUrl: string

  @Field({
    description: 'success url for coinify or stripe',
    nullable: true,
  })
  successUrl: string
}
