import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractTrue, NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.CommonType, { ...AbstractTrue })
export class CommonType {
  @Field({ ...NullableTrue, description: 'created at date' })
  created_at: string
  @Field({ ...NullableTrue, description: 'updated at date' })
  updated_at: string
}
