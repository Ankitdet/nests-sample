import { AWS_CREDENTIAL, DIGITAL_RE_BUCKET } from '@const/environments'
import { PlatformName } from '@core/enums'
import { ErrorHandler } from '@shared/errors/axios-errors'
import { logger } from '@shared/logger/logger'
import * as AWS from 'aws-sdk'
import csv from 'csvtojson'
import { camelCase } from 'lodash'
// import fs from 'fs'

const s3bucket = new AWS.S3({
  ...AWS_CREDENTIAL,
  signatureVersion: 'v4',
})

export const getRePlatform = (url: string): string => {
  if (url?.includes(PlatformName.REALt)) {
    return PlatformName.REALt
  } else if (url?.includes(PlatformName.LoftY)) {
    return PlatformName.LoftY
  } else if (url?.includes(PlatformName['3Blocks'])) {
    return PlatformName['3Blocks']
  } else if (url?.includes(PlatformName.RoofStock)) {
    return PlatformName.RoofStock
  }
  return ''
}

export const getUniqueAttrByPlatform = (platform: string): string => {
  if (
    platform === PlatformName.REALt ||
    platform === PlatformName.LoftY ||
    platform === PlatformName['3Blocks']
  ) {
    return 'fullAddress'
  }
  return ''
}

export const camelizeKeys = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v))
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    )
  }
  return obj
}

export const readDataFromS3 = async (
  key: string,
  isJson: boolean = false,
): Promise<any> => {
  try {
    const csvFile = await s3bucket
      .getObject({
        Bucket: DIGITAL_RE_BUCKET,
        Key: key,
      })
      .promise()
      .then(d => d.Body.toString('utf-8'))
    if (isJson) {
      return JSON.parse(csvFile)
    }
    return await csv().fromString(csvFile)
  } catch (e) {
    logger.error({ error: `Error while getting the object : ${JSON.stringify(e)}` })
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}

/*
try {
    const resp = fs.readFileSync(_file, "utf8")
    try {
      const customer = JSON.parse(resp);
      return customer
      console.log("Customer address is:", customer.address); // => "Customer address is: Infinity Loop Drive"
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
    return
  */
export const readDataFromFile = async (file: string): Promise<any> => {
  try {
    return await csv().fromFile(file)
  } catch (e) {
    logger.error({ error: `Error while getting the object : ${JSON.stringify(e)}` })
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}

export const deleteFile = async (key: string, bucketName: string) => {
  await s3bucket
    .deleteObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise()
}

export const getS3Key = (filename: string) => {
  let key = ''
  if (filename) {
    if (filename.includes(PlatformName.REALt)) {
      key += 'webscrapping/realt/' + filename
    } else if (filename.includes(PlatformName.LoftY)) {
      key += 'webscrapping/lofty/' + filename
    } else if (filename.includes(PlatformName['3Blocks'])) {
      key += 'webscrapping/3blocks/' + filename
    } else if (filename.includes(PlatformName.RoofStock)) {
      key += 'webscrapping/rootstock/' + filename
    } else if (filename.includes(PlatformName.Akru)) {
      key += 'webscrapping/akru/' + filename
    } else if (filename.includes('-migrating-to-')) {
      key += 'webscrapping/migrationTo/' + filename
    } else {
      logger.warn(`Not processing file : ${filename}`)
      logger.warn(`filename should contains word realt,accrue,loft etc.`)
    }
  }
  return key
}

export function getRandomFileName() {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const random = ('' + Math.random()).substring(2, 8)
  const random_number = timestamp + random
  return random_number
}

export const getWebpImageById = async (reId: string) => {
  try {
    const allImages = await s3bucket
      .listObjectsV2({
        Bucket: DIGITAL_RE_BUCKET,
        Prefix: reId,
      })
      .promise()
    const urls = []
    allImages?.Contents.forEach(async obj => {
      const objectKey = obj.Key
      const signedUrlExpireSeconds = 3600 // The URL will expire after this time period (in seconds)
      const presignedUrl = s3bucket.getSignedUrl('getObject', {
        Bucket: DIGITAL_RE_BUCKET,
        Key: objectKey, // filename
        Expires: signedUrlExpireSeconds, // time to expire in seconds
      })
      urls.push(presignedUrl)
    })
    logger.info(`reId:${reId} has generated ${urls.length} url`)
    return urls
  } catch (e) {
    ErrorHandler(e, 'Error while getting the webp images.')
  }
}

export const getAllKeysByPrefix = async (bucketName: string, prefix) => {
  const data = await s3bucket
    .listObjectsV2({
      Bucket: bucketName,
      Prefix: `${prefix}/`,
    })
    .promise()
  return data.Contents.map(file => file.Key)
}
