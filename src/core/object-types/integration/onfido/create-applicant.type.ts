import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractTrue, NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.IdNumber, { ...AbstractTrue })
class IdNumber {
  @Field({ ...NullableTrue, description: 'Type of the Id number - Onfido integration' })
  type?: string
  @Field({
    ...NullableTrue,
    description: 'Value of the Id number - Onfido integration',
  })
  value?: string
  @Field({
    ...NullableTrue,
    description: 'State code of the issuing state - Onfido integration',
  })
  stateCode?: string | null
}

@ObjectType(TypeName.AddressOptional, { ...AbstractTrue })
class AddressOptional {
  @Field({
    ...NullableTrue,
    description: 'Flat number of the applicant - Onfido Integration',
  })
  flatNumber?: string | null
  @Field({
    ...NullableTrue,
    description: 'Building number of the applicant - Onfido Integration',
  })
  buildingNumber?: string | null
  @Field({
    ...NullableTrue,
    description: 'Building name of the applicant - Onfido Integration',
  })
  buildingName?: string | null
  @Field({
    ...NullableTrue,
    description: 'street of the applicant address - Onfido Integration',
  })
  street?: string | null
  @Field({
    ...NullableTrue,
    description: 'Sub street of the applicant address - Onfido Integration',
  })
  subStreet?: string | null
  @Field({
    ...NullableTrue,
    description: 'Town of the applicant - Onfido Integration ',
  })
  town?: string | null
  @Field({
    ...NullableTrue,
    description: 'state of the applicant - Onfido Integration',
  })
  state?: string | null
  @Field({ ...NullableTrue, description: 'line1 of the address - Onfido Integration' })
  line1?: string | null
  @Field({ ...NullableTrue, description: 'line2 of the address - Onfido Integration' })
  line2?: string | null
  @Field({ ...NullableTrue, description: 'line3 of the address - Onfido Integration' })
  line3?: string | null
}

@ObjectType(TypeName.ApplicatanAddress, { ...AbstractTrue })
class Address extends AddressOptional {
  @Field({
    ...NullableTrue,
    description:
      'The postcode (ZIP code) of the applicants address. For UK postcodes,specify the value in the following format: SW4 6EH',
  })
  postcode?: string
  @Field({ ...NullableTrue, description: 'Country of the applicant' })
  country?: string
}

/** onfido Type */
@ObjectType(TypeName.ApplicantType)
export class ApplicantType {
  @Field({
    ...NullableTrue,
    description: 'The unique identifier for the applicant - Onfido Integration ',
  })
  id?: string
  @Field({
    ...NullableTrue,
    description:
      'The date and time when this applicant was created. - Onfido Integration',
  })
  createdAt?: string
  @Field({
    ...NullableTrue,
    description:
      'The date and time when this applicant is scheduled to be deleted, or null if the applicant is not scheduled to be deleted. - Onfido integration',
  })
  deleteAt?: string
  @Field({
    ...NullableTrue,
    description: 'The URI of this resource. - Onfido integration',
  })
  href?: string
  @Field({
    ...NullableTrue,
    description: 'Forename of the applicant - Onfido integration ',
  })
  firstName?: string
  @Field({
    ...NullableTrue,
    description: 'Last name of the applicant - Onfido integration ',
  })
  lastName?: string
  @Field({
    ...NullableTrue,
    description: 'The applicants email adress - Onfido integration ',
  })
  email?: string
  @Field({
    ...NullableTrue,
    description:
      'date of birth of the applicant in YYYY-MM-DD date format- Onfido integration ',
  })
  dob?: string | null
  @Field(() => Address, {
    ...NullableTrue,
    description: 'The address of the applicant - Onfido integration ',
  })
  address?: Address | null
  @Field(() => [IdNumber], {
    ...NullableTrue,
    description:
      'A collection of identification numbers belonging to this applicant. - Onfido integration ',
  })
  idNumbers?: IdNumber[] | null
}
