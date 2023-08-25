import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractTrue, NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.SanctionedFieldType, { ...AbstractTrue })
class SanctionedFieldType {
  @Field({
    ...NullableTrue,
    description:
      'The Chainalysis Entity category. For sanctioned addresses, the value will be sanctions',
  })
  category: string
  @Field({
    ...NullableTrue,
    description: 'The OFAC name associated with the sanctioned address.',
  })
  name: string
  @Field({
    ...NullableTrue,
    description: 'The OFAC description of the sanctioned address.',
  })
  description: string
  @Field({
    ...NullableTrue,
    description: 'The OFAC URL for more information about the sanctioned address',
  })
  url: string
}

@ObjectType(TypeName.AddressSanctionedType)
export class AddressSanctioned {
  @Field(() => [SanctionedFieldType], {
    ...NullableTrue,
    description: 'return address is sanctioned or not.',
  })
  identifications: [SanctionedFieldType]
}
