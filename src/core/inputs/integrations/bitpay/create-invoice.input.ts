import { getInputName, InputName } from '@core/enums'
import { ArgsType, Field, Float, InputType, Int } from '@nestjs/graphql'
import { UUID_VERSION } from '@utils/index'
import { IsUUID } from 'class-validator'

@InputType(getInputName(InputName.CreateInvoiceInput))
@ArgsType()
export class CreateInvoiceInput {
  @Field(() => String, {
    description: 'The userId of the customer',
    nullable: false,
  })
  @IsUUID(UUID_VERSION)
  user_id: string

  @Field(() => String, {
    description: 'The real estate id',
    nullable: false,
  })
  @IsUUID(UUID_VERSION)
  re_id: string

  @Field(() => Int, {
    description: 'The number of tokens',
    nullable: false,
  })
  number_of_tokens: number

  @Field(() => Float, {
    description: 'The price of each token',
    nullable: false,
  })
  token_price: number

  @Field(() => String, {
    description: 'The email of the customer',
    nullable: false,
  })
  buyer_email: number
}
