import { getInputName, InputName } from '@core/enums'
import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsNullOrEmpty } from '@shared/decorators'
import { CustomDateValidator } from '@shared/validators'
import {
  AbstractTrue,
  NullableFalse,
  NullableTrue,
  UUID_VERSION,
} from '@utils/common.utils'
import { IsOptional, IsUUID, Validate } from 'class-validator'

@InputType('IdNumberRequest', { ...AbstractTrue })
@ArgsType()
class IdNumberRequest {
  @Field({ description: 'Type of ID number. ', nullable: false })
  type: string
  @Field({
    description:
      'Value of ID number .ssn supports both the full SSN or the last 4 digits. If the full SSN is provided then it must be in the format xxx-xx-xxxx.',
    nullable: false,
  })
  value: string
  @Field({ description: 'Two letter code of issuing state. ', nullable: true })
  stateCode?: string | null
}

@InputType('AddressOptional', { ...AbstractTrue })
@ArgsType()
class AddressOptional {
  @Field({ description: 'The applicants flat number', nullable: true })
  flatNumber?: string | null
  @Field({ description: 'The building number of the applicant', nullable: true })
  buildingNumber?: string | null
  @Field({ description: 'The building name of the applicant', nullable: true })
  buildingName?: string | null
  @Field({ description: 'The street of the applicants address. ', nullable: true })
  street?: string | null
  @Field({ description: 'The sub-street of applicant address', nullable: true })
  subStreet?: string | null
  @Field({ description: 'The town of the applicant', nullable: true })
  town?: string | null
  @Field({
    description: 'The address state. US states must use the USPS abbreviation. ',
    nullable: true,
  })
  state?: string | null
  @Field({ description: 'Line 1 of the address.', nullable: true })
  line1?: string | null
  @Field({ description: 'Line 2 of the address.', nullable: true })
  line2?: string | null
  @Field({ description: 'Line 3 of the address.', nullable: true })
  line3?: string | null
}

@InputType('AddressRequest', { ...AbstractTrue })
@ArgsType()
class AddressRequest extends AddressOptional {
  @Field({
    description:
      'The postcode (ZIP code) of the applicants address. For UK postcodes,specify the value in the following format: SW4 6EH',
    nullable: true,
  })
  postcode: string
  @Field({
    description:
      'The 3 character ISO country code of this address. For example, GBR is the country code for the United Kingdom.',
    nullable: true,
  })
  country: string
}

@InputType('CreateApplicantRequest')
@ArgsType()
export class CreateApplicantRequest {
  @IsUUID(UUID_VERSION)
  @Field({ description: 'user id of user', nullable: true })
  user_id?: string | null

  @IsNullOrEmpty()
  @Field({ description: 'The applicants first name', nullable: true })
  firstName?: string | null
  @Field({ description: 'The applicants last name', nullable: true })
  lastName?: string | null
  @Field({ description: 'The applicants email address', nullable: true })
  email?: string | null

  @IsOptional()
  @Validate(CustomDateValidator, { message: '' })
  @Field({
    description: 'The applicants date of birth in YYYY-MM-DD format.',
    nullable: true,
  })
  dob?: string | null

  @Field(() => AddressRequest, {
    description: 'The applicants address request',
    nullable: true,
  })
  address?: AddressRequest | null

  @Field(() => [IdNumberRequest], {
    description: 'A collection of identification numbers belonging to this applicant.',
    nullable: true,
  })
  idNumbers?: IdNumberRequest[] | null
}

@InputType('CreateChecksRequest')
@ArgsType()
export class CreateChecksRequest {
  @Field(() => String, {
    description: 'The unique identifier for the applicant.',
    nullable: false,
  })
  applicantId: string
  @Field(() => [String], { description: 'The name of the reports', nullable: false })
  reportNames: string[]
  @Field(() => [String], {
    description: 'The ID of the applicant document',
    nullable: true,
  })
  documentIds?: string[] | null
  @Field({
    description: 'Run an applicant provides data check or not. Default is false ',
    nullable: true,
  })
  applicantProvidesData?: boolean
  @Field(() => Boolean, {
    description:
      'the request to create a check will only return a response when all the reports in the check complete the automatic part of the review, or the request times out after 29 seconds if all reports are completed automatically, the check response is returned with a status of complete',
    nullable: true,
  })
  asynchronous?: boolean
  @Field(() => [String], {
    description: 'A list of tags associated with the check.',
    nullable: true,
  })
  tags?: string[] | null
  @Field(() => Boolean, { description: 'suppress form emails', nullable: true })
  suppressFormEmails?: boolean
  @Field(() => String, {
    description:
      'For checks where applicant provides data is true, redirect to this URI when the applicant has submitted their data.',
    nullable: true,
  })
  redirectUri?: string | null
  @Field(() => Boolean, {
    description: 'privacy notices read consent given',
    nullable: true,
  })
  privacyNoticesReadConsentGiven?: boolean
  @Field(() => String, {
    description:
      'Array of strings describing which webhooks to trigger for this check. By default, all webhooks registered in the account will be triggered and this value will be null in the responses.',
    nullable: true,
  })
  webhookIds?: string[] | null
  @Field(() => String, {
    description:
      'The sub result of the report. It gives a more detailed result for Document reports only, and will be null otherwise.',
    nullable: true,
  })
  subResult?: string
  @Field(() => [String], {
    description:
      'Array of names of particular reports to return consider as their results.',
    nullable: true,
  })
  consider?: string[]
}

@InputType(getInputName(InputName.GenerateTokenInput))
@ArgsType()
export class GenerateSdkTokenRequest {
  @Field(() => String, {
    ...NullableFalse,
    description: 'The id of the applicant to whom the document belongs.',
  })
  applicantId: string
  @Field(() => String, {
    ...NullableTrue,
    description: 'The unique identifier for the applicants application',
  })
  applicationId?: string | null
  @Field(() => String, {
    ...NullableTrue,
    description:
      'referrer argument specifies the URL of the web page,where web SDK will be used. It garuntees that other malicious website cannot result the SDK token in case it is lost',
  })
  referrer?: string | null
  @Field(() => String, {
    ...NullableTrue,
    description:
      'Introductory screen is seen when SDK client is loaded on Mobile browser',
  })
  crossDeviceUrl?: string | null
}

export interface IOnfidoUploadDocument {
  id: string
  applicantId: string | null
  createdAt: string
  href: string
  downloadHref: string
  fileName: string
  fileType: string
  fileSize: number
  type: string
  side: string | null
  issuingCountry: string | null
}
