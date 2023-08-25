import { TypeName } from '@core/enums'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.LivePhotoType)
export class OnfidoLivePhotoType {
  @Field({ ...NullableTrue, description: 'The unique identifier of the live photo.' })
  id: string
  @Field({
    ...NullableTrue,
    description: 'The date and time at which the live photo was uploaded.',
  })
  createdAt?: string
  @Field({ ...NullableTrue, description: 'The URI of this resource.' })
  href?: string
  @Field({
    ...NullableTrue,
    description: 'The URI that can be used to download the live photo.',
  })
  downloadHref?: string
  @Field({ ...NullableTrue, description: 'The name of the uploaded file.' })
  fileName?: string
  @Field({ ...NullableTrue, description: 'The file type of the uploaded file.' })
  fileType?: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The size of the uploaded file in bytes.',
  })
  fileSize?: number
}
