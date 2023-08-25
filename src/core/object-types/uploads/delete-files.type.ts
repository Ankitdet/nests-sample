import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractTrue } from '@utils/common.utils'

@ObjectType(TypeName.DeleteFileObject, { ...AbstractTrue })
class DeletedObject {
  /**
   * The name of the deleted object.
   */
  @Field(() => String, { description: 'object keys', nullable: true })
  Key?: string
  /**
   * The version ID of the deleted object.
   */
  @Field(() => String, { description: 'version id', nullable: true })
  VersionId?: string
  /**
   * Specifies whether the versioned object that was permanently deleted was (true) or was not (false) a delete marker.
   * In a simple DELETE,
   * this header indicates whether (true) or not (false) a delete marker was created.
   */
  @Field(() => Boolean, {
    description:
      ' It specifies wheather the versioned object is permanently deleted(ture) or not(false) a delete marker was created ',
    nullable: true,
  })
  DeleteMarker?: boolean
  /**
   * The version ID of the delete marker created as a result of the DELETE operation.
   * If you delete a specific object version,
   * the value returned by this header is the version ID of the object version deleted.
   */
  @Field(() => String, {
    description:
      'It is the result of Delete operation. If a specific object version is deleted then the returned value by the header is the version Id of the version deleted',
    nullable: true,
  })
  DeleteMarkerVersionId?: string
}

@ObjectType(TypeName.DeleteFileError, { ...AbstractTrue })
class Error {
  /**
   * The error key.
   */
  @Field(() => String, { description: 'The error keys', nullable: true })
  Key?: string
  /**
   * The version ID of the error.
   */
  @Field(() => String, { description: 'The version Id of the error', nullable: true })
  VersionId?: String

  @Field(() => String, { description: 'Code for the error', nullable: true })
  Code?: string
  @Field(() => String, { description: 'Message due to error', nullable: true })
  Message?: string
}

@ObjectType(TypeName.DeleteFilesType)
export class DeleteFilesType {
  @Field(() => [DeletedObject], {
    description: 'return deleted object in array',
    nullable: true,
  })
  Deleted?: DeletedObject[]

  @Field(() => String, { description: 'request charged due to error', nullable: true })
  RequestCharged?: string

  @Field(() => [Error], {
    description: 'The unexpected condition occured',
    nullable: true,
  })
  Errors?: Error[]
}
