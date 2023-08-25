import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType(TypeName.UploadedType)
export class UploadedType {
  @Field({ nullable: true, description: 'Etag of the property' })
  ETag?: string
  @Field({ nullable: true, description: 'The geographical location of the property' })
  Location?: string
  @Field({ nullable: true, description: 'Key-It is a tag of the uploaded file' })
  key?: string
  @Field({ nullable: true, description: 'Key-It is a tag of the uploaded file' })
  Key?: string
  @Field({
    nullable: false,
    description: 'The bucket used to store the files of the property',
  })
  Bucket?: string
}
