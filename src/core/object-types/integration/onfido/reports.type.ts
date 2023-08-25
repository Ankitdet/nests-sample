import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.ReportsType)
export class ReportsType {
  @Field({
    ...NullableTrue,
    description: 'The date and time at which the report was first initiated.',
  })
  createdAt?: string
  @Field({ ...NullableTrue, description: 'The API endpoint to retrieve the report.' })
  href?: string
  @Field({ ...NullableTrue, description: 'The unique identifier for the report.' })
  id?: string
  @Field({ ...NullableTrue, description: 'The type of the report' })
  name?: string
  @Field({
    ...NullableTrue,
    description: 'The current state of the report in the checking process.',
  })
  status?: string
  @Field({
    ...NullableTrue,
    description: 'The result of the report (null if report is incomplete).',
  })
  result?: string | null
  @Field({
    ...NullableTrue,
    description:
      'The sub_result of the report. It gives a more detailed result for Document reports only, and will be null otherwise.',
  })
  subResult?: string | null
  @Field({
    ...NullableTrue,
    description: 'The properties associated with the report, if any. ',
  })
  properties?: string | null
  @Field({
    ...NullableTrue,
    description: 'The details of the report. This is specific to each type of report.',
  })
  breakdown?: string | null
  @Field({
    ...NullableTrue,
    description:
      'The document IDs that were processed. Populated for Document and Facial Similarity reports, otherwise an empty array.',
  })
  documents?: string
  @Field({
    ...NullableTrue,
    description: 'The ID of the check to which the report belongs.',
  })
  checkId?: string
}
