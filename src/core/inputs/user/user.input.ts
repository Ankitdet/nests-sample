import { getInputName, InputName } from '@core/enums'
import { Role } from '@core/enums/role.enum'
import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { UUID_VERSION } from '@utils/common.utils'
import { IsUUID } from 'class-validator'

@InputType(getInputName(InputName.UserAttrInput))
@ArgsType()
class UserAttrInput {
  @Field({
    description: 'email id of user',
    nullable: true,
  })
  email: string
}

@InputType(getInputName(InputName.UpdateCognitoUserInput))
@ArgsType()
export class UpdateCognitoUserInput {
  @Field(() => Role, {
    description: 'role of user',
    nullable: true,
  })
  role: Role

  @Field({
    description: 'id of user',
    nullable: true,
  })
  @IsUUID(UUID_VERSION)
  user_id: string

  @Field(() => UserAttrInput, {
    description: 'user`s attribute',
    nullable: true,
  })
  user: UserAttrInput

  constructor(data: Partial<UpdateCognitoUserInput>) {
    Object.assign(this, data)
  }
}

@InputType(getInputName(InputName.CreateWhiteListAddressInput))
@ArgsType()
export class CreateWhiteListAddressInput {
  @Field({
    description: 'whitelist address',
    nullable: true,
  })
  whitelist_address: string

  @Field({
    description: 'id of user',
    nullable: true,
  })
  @IsUUID(UUID_VERSION)
  user_id: string

  constructor(data: Partial<UpdateCognitoUserInput>) {
    Object.assign(this, data)
  }
}
