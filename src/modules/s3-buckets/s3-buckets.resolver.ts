import { AppResolver } from '@app/app.resolver'
import { AWS_CREDENTIAL } from '@const/environments'
import { QUERY_METHOD_DECORATOR } from '@core/decorators'
import { DeleteKeysInput } from '@core/inputs'
import { DeleteKeys, IPPMDocumentLink, IPreSignedUrl, Uploaded } from '@core/interfaces'
import {
  DeleteFilesType,
  ListObjectsOutputType,
  UploadedType,
} from '@core/object-types'
import { PreSignedUrlType } from '@core/object-types/uploads/pre-signed-url.type'
// import { PreSignedUrlType } from '@core/object-types/uploads/pre-signed-url.type'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UUIDValidationPipe } from '@shared/pipe'
import { imageFileFilter } from '@utils/file-upload.utils'
import * as AWS from 'aws-sdk'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { logger } from '../../shared/logger/logger'
import {
  deleteObjects,
  getPPMdoc,
  getPreSignedUrl,
  listAllObjectsFromS3Bucket,
  uploadS3Data,
} from './s3utils'

AWS.config.update(AWS_CREDENTIAL)

@Resolver()
export class S3Resolver extends AppResolver {
  /*eslint no-empty: "error"*/
  constructor() {
    // empty
    super()
  }

  /*
    select body option postman,
    operations: {"query":"mutation uploadSingle($file:Upload!) {\n uploadSingle(file:$file)  { Location} \n}", "variables": { "file": null }}
    map: {"0": ["variables.file"] }
    0: <attach_file>
  */
  @Mutation(() => UploadedType)
  async uploadSingle(
    @Args('id', {}) id: string,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { filename, createReadStream, mimetype, encoding }: FileUpload,
    @Args('isHomePhoto', { nullable: true }) isHomePhoto?: boolean,
  ): Promise<Uploaded | any> {
    logger.info(`Entering into upload single mutation, filename is ${filename}`)

    await imageFileFilter(filename)

    return new Promise(async resolve => {
      const fileStream = createReadStream()
      const returnData = await uploadS3Data(
        fileStream,
        filename,
        mimetype,
        encoding,
        id,
        isHomePhoto,
      )
      resolve(returnData)
    })
  }

  /*
    select body option postman
      operations: {"query":"mutation($files: [Upload!]!) { uploadMany(files:$files) { Location}}","variable":{"files": [null, null,null,null]}}
      map: {"0":["variables.files.0"], "1": ["variables.files.1"], "2": ["variables.files.2"], "3":["variables.files.3"]}
      0: <attach_file>
      1: <attach_file>
      2: <attach_file>
      3: <attach_file>

    */
  @Mutation(() => [UploadedType], { deprecationReason: 'Not in used.' })
  async uploadMany(
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    imgs: FileUpload[],
    @Args('id') id: string,
  ): Promise<any> {
    const fileUpload = []
    const promises = imgs.map(async img => {
      const { filename, mimetype, encoding, createReadStream } = await img
      await imageFileFilter(filename)
      const fileStream = createReadStream()
      return uploadS3Data(fileStream, filename, mimetype, encoding, id).then(base64 => {
        fileUpload.push(base64)
      })
    })

    // Wait for all Promises to complete
    return await Promise.all(promises)
      .then(_results => {
        return fileUpload
      })
      .catch(e => {
        logger.error('error while performing multipler uploads.', e)
        throw e
      })
  }

  @Mutation(() => DeleteFilesType)
  async deleteFiles(
    @Args('keys', { name: 'keys', description: 'the name of key that want to delete' })
    deleteKeys: DeleteKeysInput,
    @Args('id', { description: 'property id' }) id: string,
  ): Promise<DeleteFilesType> {
    const array: DeleteKeys[] = []
    deleteKeys.keys.map(key => {
      array.push({
        Key: String(`${id}/${key}`),
      })
    })
    return await deleteObjects(array)
  }

  @Query(
    QUERY_METHOD_DECORATOR.listFiles.return,
    QUERY_METHOD_DECORATOR.listFiles.options,
  )
  async listFiles(
    @Args('id', { description: 'property id' }) id: string,
  ): Promise<ListObjectsOutputType[]> {
    return await listAllObjectsFromS3Bucket(id)
  }

  @Query(() => [PreSignedUrlType], { deprecationReason: 'Not in use.' })
  async preSignedUrl(
    @Args('keys', {
      name: 'keys',
      description: 'key or filename',
      type: () => [String],
    })
    keys: [string],
    @Args('re_id', { description: 'real estate id' }) re_id: string,
  ): Promise<IPreSignedUrl[]> {
    return await getPreSignedUrl(re_id, keys)
  }

  @Query(
    QUERY_METHOD_DECORATOR.getAgreementDocLink.return,
    QUERY_METHOD_DECORATOR.getAgreementDocLink.options,
  )
  async getPPMDocumentLink(
    @Args('re_id', { description: 'real estate id' }, UUIDValidationPipe) re_id: string,
  ): Promise<IPPMDocumentLink> {
    return await getPPMdoc(re_id)
  }
}
