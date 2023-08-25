import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { AbstractTrue } from '@utils/common.utils'

@InputType('UpdateIdNumberRequest', { ...AbstractTrue })
@ArgsType()
class IdNumberRequest {
  @Field({ description: 'Type of the Id number', nullable: false })
  type: string
  @Field({ description: 'Value of the Id number', nullable: false })
  value: string
  @Field({ description: 'Two letter code of issuing state.', nullable: true })
  stateCode?: string | null
}
@InputType('UpdateAddressOptional', { ...AbstractTrue })
@ArgsType()
class AddressOptional {
  @Field({ description: 'The flat number of the applicant', nullable: true })
  flatNumber?: string | null
  @Field({ description: 'Building number of the applicant', nullable: true })
  buildingNumber?: string | null
  @Field({ description: 'Building name of the applicant', nullable: true })
  buildingName?: string | null
  @Field({ description: 'The street of the applicant address', nullable: true })
  street?: string | null
  @Field({ description: 'The sub-street of the applicant address', nullable: true })
  subStreet?: string | null
  @Field({ description: 'The town of the applicant', nullable: true })
  town?: string | null
  @Field({
    description: 'The address state. (US states must use the USPS abbreviation.)',
    nullable: true,
  })
  state?: string | null
  @Field({ description: 'line1 of the address', nullable: true })
  line1?: string | null
  @Field({ description: 'line2 of the address', nullable: true })
  line2?: string | null
  @Field({ description: 'line3 of the address', nullable: true })
  line3?: string | null
}

@InputType('UpdateAddressRequest', { ...AbstractTrue })
@ArgsType()
class AddressRequest extends AddressOptional {
  @Field({
    description:
      'The postcode (ZIP code) of the applicants address. For UK postcodes,specify the value in the following format: SW4 6EH',
    nullable: true,
  })
  postcode: string
  @Field({ description: 'The country of the applicant', nullable: true })
  country: string
}

@InputType('UpdateApplicantRequest')
@ArgsType()
export class UpdateApplicantRequest {
  @Field({ description: 'The applicants first name', nullable: true })
  firstName?: string | null
  @Field({ description: 'The applicants last name', nullable: true })
  lastName?: string | null
  @Field({ description: 'The appllicants email address', nullable: true })
  email?: string | null
  @Field({
    description: 'Date of birth of the applicant in yyyy-mm-dd date format',
    nullable: true,
  })
  dob?: string | null
  @Field(() => AddressRequest, {
    description: 'The address of the applicant.',
    nullable: true,
  })
  address?: AddressRequest | null

  @Field(() => IdNumberRequest, {
    description: 'A collection of identification numbers belonging to this applicant.',
    nullable: true,
  })
  idNumbers?: IdNumberRequest[] | null
}
