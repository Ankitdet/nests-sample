import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType(TypeName.PreSignedUrlType)
export class PreSignedUrlType {
  @Field({ nullable: true, description: 'key or file name' })
  key?: string
  @Field({ nullable: true, description: 'generated pre signed url for s3 upload' })
  url?: string
}

@ObjectType(TypeName.AgreementDocumentLinkType)
export class AgreementDocumentLinkType {
  @Field({ nullable: false, description: 'ppm document link.' })
  ppmLink?: string
  @Field({ nullable: false, description: 'operating agreement document link.' })
  operatingLink?: string
  @Field({ nullable: false, description: 'subscription agreement document link.' })
  subscriptionLink?: string
}
