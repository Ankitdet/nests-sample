import { getInputName, InputName } from '@core/enums'
import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { UUID_VERSION } from '@utils/index'
import { IsUUID } from 'class-validator'
import { CreateOrderInput } from '../..'

@InputType(getInputName(InputName.CreatePaymentInput))
@ArgsType()
export class CreatePaymentInput extends CreateOrderInput {
  @Field(() => String, {
    description: 'The user id of the customer',
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
}
