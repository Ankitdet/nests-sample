import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractTrue } from '@utils/common.utils'

@ObjectType(TypeName.ListFileCommonPrefix, { ...AbstractTrue })
class ListFileCommonPrefix {
  @Field({
    description: 'Container for the specified common prefix.',
    nullable: true,
  })
  Prefix?: string
}

@ObjectType(TypeName.ListFileOwner, { ...AbstractTrue })
class ListFileOwner {
  /**
   *
   */
  @Field({
    description: 'Container for the display name of the owner.',
    nullable: true,
  })
  DisplayName?: string
  /**
   *
   */
  @Field({
    description: 'Container for the ID of the owner.',
    nullable: true,
  })
  ID?: string
}

@ObjectType(TypeName.ListFileObject, { ...AbstractTrue })
class ListFileObject {
  /**
   *
   */
  @Field({
    description:
      'The name that you assign to an object. You use the object key to retrieve the object.',
    nullable: true,
  })
  Key?: string
  /**
   *
   */
  @Field({ description: 'Creation date of the object.', nullable: true })
  LastModified?: Date
  /**
   */
  @Field({
    description:
      'The entity tag is a hash of the object. The ETag reflects changes only to the contents of an object, not its metadata. The ETag may or may not be an MD5 digest of the object data. Whether or not it is depends on how the object was created and how it is encrypted as described below:   Objects created by the PUT Object, POST Object, or Copy operation, or through the Amazon Web Services Management Console, and are encrypted by SSE-S3 or plaintext, have ETags that are an MD5 digest of their object data.   Objects created by the PUT Object, POST Object, or Copy operation, or through the Amazon Web Services Management Console, and are encrypted by SSE-C or SSE-KMS, have ETags that are not an MD5 digest of their object data.   If an object is created by either the Multipart Upload or Part Copy operation, the ETag is not an MD5 digest, regardless of the method of encryption',
    nullable: true,
  })
  ETag?: string
  /**
   * Size in bytes of the object
   */
  @Field(() => Number, { description: 'Size in bytes of the object', nullable: true })
  Size?: number
  /**
   *
   */
  @Field({
    description: 'The class of storage used to store the object.',
    nullable: true,
  })
  StorageClass?: string
  /**
   *
   */
  @Field(() => ListFileOwner, {
    description: 'The owner of the object',
    nullable: true,
  })
  Owner?: ListFileOwner
}

@ObjectType(TypeName.ListObjectsOutputType, { ...AbstractTrue })
export class ListObjectsOutputType {
  /**
   *
   */
  @Field({
    description:
      'A flag that indicates whether Amazon S3 returned all of the results that satisfied the search criteria.',
    nullable: true,
  })
  IsTruncated?: boolean
  /**
   *
   */
  @Field({
    description:
      'Indicates where in the bucket listing begins. Marker is included in the response if it was sent with the request.',
    nullable: true,
  })
  Marker?: string
  /**
   */
  @Field({
    description:
      'When response is truncated (the IsTruncated element value in the response is true), you can use the key name in this field as marker in the subsequent request to get next set of objects. Amazon S3 lists objects in alphabetical order Note: This element is returned only if you have delimiter request parameter specified. If response does not include the NextMarker and it is truncated, you can use the value of the last Key in the response as the marker in the subsequent request to get the next set of object keys.',
    nullable: true,
  })
  NextMarker?: string
  /**
   *
   */
  @Field(() => ListFileObject, {
    description: 'Metadata about each object returned.',
    nullable: true,
  })
  Contents?: ListFileObject
  /**
   *
   */
  @Field({ description: 'The bucket name.', nullable: true })
  Name?: string
  /**
   *
   */
  @Field({
    description: 'Keys that begin with the indicated prefix.',
    nullable: true,
  })
  Prefix?: string
  /**
   *
   */
  @Field({
    description:
      'Causes keys that contain the same string between the prefix and the first occurrence of the delimiter to be rolled up into a single result element in the CommonPrefixes collection. These rolled-up keys are not returned elsewhere in the response. Each rolled-up result counts as only one return against the MaxKeys value.',
    nullable: true,
  })
  Delimiter?: string

  @Field(() => Number, {
    description: 'The maximum number of keys returned in the response body.',
    nullable: true,
  })
  MaxKeys?: number

  @Field(() => [ListFileCommonPrefix], {
    description:
      'All of the keys (up to 1,000) rolled up in a common prefix count as a single return when calculating the number of returns.  A response can contain CommonPrefixes only if you specify a delimiter. CommonPrefixes contains all (if there are any) keys between Prefix and the next occurrence of the string specified by the delimiter.  CommonPrefixes lists keys that act like subdirectories in the directory specified by Prefix. For example, if the prefix is notes/ and the delimiter is a slash (/) as in notes/summer/july, the common prefix is notes/summer/. All of the keys that roll up into a common prefix count as a single return when calculating the number of returns',
    nullable: true,
  })
  CommonPrefixes?: ListFileCommonPrefix[]

  @Field({
    description:
      'Encoding type used by Amazon S3 to encode object keys in the response.',
    nullable: true,
  })
  EncodingType?: string | 'url'

  @Field({
    description:
      'Encoding type used by Amazon S3 to encode object keys in the response.',
    nullable: true,
  })
  imageUrl?: string | null
}
