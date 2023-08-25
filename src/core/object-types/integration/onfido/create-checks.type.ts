import { TypeName } from '@core/enums'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.ChecksType)
export class ChecksType {
  @Field({ ...NullableTrue, description: 'The unique identifier for the check. ' })
  id?: string
  @Field({
    ...NullableTrue,
    description: 'The date and time at which the check was initiated.',
  })
  createdAt?: string
  @Field({ ...NullableTrue, description: 'The API endpoint to retrieve the check.' })
  href?: string
  @Field({ ...NullableTrue, description: 'The API endpoint to download the check' })
  downloadHref?: string
  @Field({ ...NullableTrue, description: 'File name for the check' })
  fileName?: string
  @Field({ ...NullableTrue, description: 'File type for the check' })
  fileType?: string
  @Field(() => Int, { ...NullableTrue, description: 'File size for the check' })
  fileSize?: number
  @Field(() => [String], {
    ...NullableTrue,
    description: 'The list of report object IDs associated with the check.',
  })
  reportIds?: [string]
  @Field({
    ...NullableTrue,
    description: 'The ID for the applicant associated with the check.',
  })
  applicantId?: string
  @Field({
    ...NullableTrue,
    description: 'applicant provides data check or not. Default is false.',
  })
  applicantProvidesData?: boolean
  @Field({
    ...NullableTrue,
    description: 'The current state of the check in the checking process.',
  })
  status?: string
  @Field(() => [String], {
    ...NullableTrue,
    description: 'A list of tags associated with this check.',
  })
  tags?: [String]
  @Field({
    ...NullableTrue,
    description:
      'The overall result of the check, based on the results of the reports used.',
  })
  result?: string | null
  @Field({
    ...NullableTrue,
    description: 'A link to the applicant form, if applicant provides data is true.',
  })
  formUri?: string | null
  @Field({
    ...NullableTrue,
    description:
      'For checks where applicant provides data is true, redirect to this URI when the applicant has submitted their data.',
  })
  redirectUri?: string | null
  @Field({
    ...NullableTrue,
    description: 'A link to the corresponding results page on the Onfido Dashboard',
  })
  resultsUri?: string
  @Field({
    ...NullableTrue,
    description:
      'Indicates that the privacy notices and terms of service have been read and, where specific laws require, that consent has been given for Onfido. This will be true if specified during check creation, otherwise it will be null.',
  })
  privacyNoticesReadConsentGiven?: boolean
  @Field(() => [String], {
    ...NullableTrue,
    description:
      'The list of registered webhook IDs to notify as part of this check. Unless the value is included during check creation, this parameter will be null.',
  })
  webhookIds?: [string] | null
}
