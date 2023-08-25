import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.TransferDataType)
export class TransferDataType {
  @Field({
    ...NullableTrue,
    description: 'result',
  })
  result: string | null
}
@ObjectType(TypeName.WhitelistAddressesType)
export class WhitelistAddressesType {
  @Field({
    ...NullableTrue,
    description: 'result',
  })
  result: string | null
}
@ObjectType(TypeName.IsAddressWhitelistedReturnType)
export class IsAddressWhitelistedReturnType {
  @Field({
    ...NullableTrue,
    description: 'result',
  })
  result: string | null
}
