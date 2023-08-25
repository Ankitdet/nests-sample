import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.UploadDocumentType)
export class OnfidoUploadDocumentType {
  @Field({
    ...NullableTrue,
    description: 'The unique identifier of the uploaded document.',
  })
  id?: string
  @Field({ ...NullableTrue, description: 'The applicant Id of the uploaded document' })
  applicantId?: string | null
  @Field({
    ...NullableTrue,
    description: 'Date and time at which the document was uploaded',
  })
  createdAt?: string
  @Field({ ...NullableTrue, description: 'The URI of this resource.' })
  href?: string
  @Field({
    ...NullableTrue,
    description: 'The URI that can be used to download the document.',
  })
  downloadHref?: string
  @Field({ ...NullableTrue, description: 'The name of the uploaded file.' })
  fileName?: string
  @Field({ ...NullableTrue, description: 'The file type of the uploaded file.' })
  fileType?: string
  @Field({ ...NullableTrue, description: 'The size of the file uploaded in bytes.' })
  fileSize?: number
  @Field({ ...NullableTrue, description: 'The type of the Document uploadec' })
  type?: string
  @Field({
    ...NullableTrue,
    description:
      'The side of the document, if applicable. The possible values are front and back.',
  })
  side?: string | null
  @Field({
    ...NullableTrue,
    description:
      'The issuing country of the document, in 3-letter ISO code, specified when uploading it.',
  })
  issuingCountry?: string | null
}
