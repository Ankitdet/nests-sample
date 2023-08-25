import {
  /* AWS_CREDENTIAL */ AWS_CREDENTIAL,
  BUCKET_NAME,
  DIGITAL_RE_BUCKET,
} from '@const/environments'
import { DeleteKeys, IPreSignedUrl } from '@core/interfaces'
import {
  DeleteFilesType,
  ListObjectsOutputType,
  UploadedType,
} from '@core/object-types'
import { axiosGet } from '@shared/base.http.service'
import { errorMessages } from '@shared/errors'
import { FILE_TYPE_ALLOWED, getRandomFileName } from '@utils/index'
import * as AWS from 'aws-sdk'
import fileType from 'file-type'
import * as fs from 'fs'
import sharp from 'sharp'
import { ErrorHandler } from '../../shared/errors/axios-errors'
import { logger } from '../../shared/logger/logger'

const s3bucket = new AWS.S3({
  ...AWS_CREDENTIAL,
  signatureVersion: 'v4',
})

export async function deleteObjects(keys: DeleteKeys[]): Promise<DeleteFilesType> {
  const params = {
    Bucket: BUCKET_NAME,
    Delete: {
      Objects: keys,
    },
  }
  try {
    return await s3bucket.deleteObjects(params).promise()
  } catch (e) {
    return null
  }
}

export async function listObjects(): Promise<Boolean> {
  const params = {
    Bucket: BUCKET_NAME,
  }
  try {
    await s3bucket.listObjects(params).promise()
    return true
  } catch (e) {
    return false
  }
}

export async function uploadS3Data(
  fileStream: fs.ReadStream,
  filename: string,
  _mimetype: string,
  encoding: string,
  id: string,
  isHomePhoto: boolean = false,
): Promise<UploadedType> {
  const filext = filename.split('.').pop()
  const fileNameisHomePhoto = id + '.' + filext
  logger.info(`aws credentials ${JSON.stringify(AWS_CREDENTIAL)}`)
  return new Promise((resolve, reject) => {
    s3bucket.upload(
      {
        Bucket: BUCKET_NAME + '/' + id,
        Key: isHomePhoto ? fileNameisHomePhoto : filename,
        ACL: 'public-read',
        Body: fileStream,
        ContentType: _mimetype,
        ContentEncoding: encoding,
      },
      function (err, data) {
        fileStream.destroy()
        if (err) {
          return reject(err)
        }
        return resolve(data)
      },
    )
  })
}

export const listAllObjectsFromS3Bucket = async (
  prefix: any,
): Promise<ListObjectsOutputType[]> => {
  const elements: ListObjectsOutputType[] = []
  const params = { Bucket: BUCKET_NAME }
  if (prefix) params[`Prefix`] = `${prefix}/`
  try {
    const response = await s3bucket.listObjects(params).promise()
    response.Contents.forEach(item => {
      if (item.Key.endsWith('.webp')) {
        params['Key'] = item.Key
        delete params['Prefix']
        delete params['Marker']
        const url = s3bucket.getSignedUrl('getObject', params)
        elements.push({
          Contents: {
            Key: item.Key,
            ETag: item.ETag,
            LastModified: item.LastModified,
            StorageClass: item.StorageClass,
            Size: item.Size,
          },
          imageUrl: url,
        })
      }
    })
  } catch (error) {
    throw error
  }
  return elements
}

export const getPPMdoc = async (re_id: string): Promise<any> => {
  const elements: ListObjectsOutputType[] = []
  const params = { Bucket: BUCKET_NAME }
  params[`Prefix`] = `public/reId/${re_id}/`
  const response = await s3bucket.listObjects(params).promise()
  response.Contents.forEach(item => {
    if (item.Key && item.Key.endsWith('.pdf')) {
      params['Key'] = item.Key
      delete params['Prefix']
      delete params['Marker']
      const url = s3bucket.getSignedUrl('getObject', params)
      elements.push({
        Contents: {
          Key: item.Key,
          ETag: item.ETag,
          LastModified: item.LastModified,
          StorageClass: item.StorageClass,
          Size: item.Size,
        },
        imageUrl: url,
      })
    }
  })
  const json = {
    ppmLink: `File not found for given ${re_id}`,
    operatingLink: `File not found for given ${re_id}`,
    subscriptionLink: `File not found for given ${re_id}`,
  }
  elements.forEach(e => {
    if (e.Contents.Key.includes('ppm')) {
      json.ppmLink = e.imageUrl
    } else if (e.Contents.Key.includes('operating')) {
      json.operatingLink = e.imageUrl
    } else if (e.Contents.Key.includes('subscription')) {
      json.subscriptionLink = e.imageUrl
    }
  })
  return json
}

export const getPreSignedUrl = async (
  re_id: string,
  _key?: [string],
): Promise<[IPreSignedUrl]> => {
  if (_key.length > 20) {
    throw new Error(errorMessages.error['S3-001'])
  }
  const returnData = []
  for (let i = 0; i < _key.length; i++) {
    const url = await s3bucket.getSignedUrlPromise('putObject', {
      Bucket: BUCKET_NAME + '/' + re_id,
      Key: _key[i],
      ContentType: 'image/*',
      Expires: 60 * 5,
    })
    returnData.push({
      key: _key[i],
      url,
    })
  }
  return returnData as [IPreSignedUrl]
}

export const convertImagesToWebp = async (re_id: string) => {
  return new Promise(async (res, rej) => {
    const keys = []
    ;(
      await s3bucket
        .listObjectsV2({
          Bucket: BUCKET_NAME,
          Prefix: `${re_id}/`,
        })
        .promise()
    ).Contents.map(resp => {
      if (resp.Key.match(FILE_TYPE_ALLOWED)) {
        keys.push(resp.Key)
      }
    })
    if (keys.length === 0) {
      logger.info(`No keys found for the reId ${re_id}`)
      res(`No keys found for the reId ${re_id}`)
    }
    for (let i = 0; i < keys.length; i++) {
      try {
        const resource = await s3bucket
          .getObject({ Bucket: BUCKET_NAME, Key: keys[i] })
          .promise()
        const bf = resource.Body as Buffer
        const pipeline = await sharp(bf)
          .webp({ quality: +20 })
          .toBuffer()
        const replaceKey = keys[i].replace(FILE_TYPE_ALLOWED, '.webp')
        await s3bucket
          .putObject({
            Body: pipeline,
            Bucket: BUCKET_NAME,
            ContentType: 'image/webp',
            CacheControl: 'max-age=31536000',
            Key: replaceKey,
            StorageClass: 'STANDARD',
            ACL: 'public-read',
          })
          .promise()
        // await s3bucket.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise()
        // https://stackoverflow.com/questions/58584206/lambdaedge-timeout-and-s3-image-processing
      } catch (e) {
        rej(e)
      }
    }
    res('image conversation done.')
  })
}

const uploadAttachmentToS3 = async (
  type: string,
  buffer: any,
  reId: string,
  filename: string,
) => {
  const params = {
    Key: `${reId}/${filename}`,
    Body: buffer,
    Bucket: DIGITAL_RE_BUCKET,
    ContentType: type,
    ACL: 'bucket-owner-full-control',
  }
  let resp = null
  try {
    resp = await s3bucket.upload(params).promise()
  } catch (e) {
    ErrorHandler(e, `Error while uploading buffer frm image URL ${JSON.stringify(e)}`)
  }
  return resp
}

export const downloadAttachment = async (url: string, reId: string) => {
  const filename = getRandomFileName() + '.webp'
  const bufferResp = await axiosGet(url, {
    responseType: 'arraybuffer',
  })
  const buffer = Buffer.from(bufferResp, 'base64')
  const type = (await fileType.fromBuffer(buffer)).mime
  try {
    return await uploadAttachmentToS3(type, buffer, reId, filename)
  } catch (e) {
    ErrorHandler(e, `Image not uploaded for the ${url}`)
  }
}

export async function uploadUtil(
  fileStream: fs.ReadStream,
  mimetype: string,
  encoding: string,
  key: string,
  bucket: string,
): Promise<UploadedType> {
  return new Promise((resolve, reject) => {
    s3bucket.upload(
      {
        Bucket: bucket,
        Key: key,
        ACL: 'bucket-owner-full-control',
        Body: fileStream,
        ContentType: mimetype,
        ContentEncoding: encoding,
      },
      function (err, data) {
        fileStream.destroy()
        if (err) {
          logger.error('Error while uploading to the S3 bucket.')
          return reject(err)
        }
        logger.info('Uploaded successfully !!!')
        return resolve(data)
      },
    )
  })
}

export const listWebscrappingS3 = async () => {
  return await s3bucket
    .listObjectsV2({ Bucket: DIGITAL_RE_BUCKET, Delimiter: '/', Prefix: '' })
    .promise()
}
