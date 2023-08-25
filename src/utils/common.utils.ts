import { Keys } from '@db/core/dynamo-enum'
import { HttpStatus } from '@nestjs/common'
import { Complexity, FieldMiddleware } from '@nestjs/graphql'
import { BaseError, EmptyListError, EmptyObjectError } from '@shared/errors'
import * as ejs from 'ejs'
// import * as crypto from 'crypto'
import * as fs from 'fs'
import https from 'https'
import _ from 'lodash'
import moment from 'moment'
import path from 'path'
import * as referralCodes from 'referral-codes'
import { RoleArray } from '.'
import { logger } from '../shared/logger/logger'

// https://github.com/you-dont-need/You-Dont-Need-Momentjs
// import moment from 'moment';
// const newTime = moment().format('L')

// UUID Version defined.
export const UUID_VERSION = '4'

function isUpperCase(str) {
  return str === str.toUpperCase()
}

export const snakeCase = (camelCaseString: any) => {
  if (camelCaseString === isUpperCase(camelCaseString)) return camelCaseString
  return camelCaseString.replace(/[A-Z]/g, char => `_${char.toLowerCase()}`)
}

export const camelCase = (snakeCaseString: any) => {
  // we are ignoring the re_id and user_id, rest we are updating.
  if (snakeCaseString === 're_id' || snakeCaseString === 'user_id')
    return snakeCaseString
  return snakeCaseString
    .replace(/_[0-9]/g, underscoreDigit => underscoreDigit[1])
    .replace(/_[a-z]/g, underscoreChar => underscoreChar[1].toUpperCase())
}

const deepMapObjectKeys = (value, f) => {
  if (!(value instanceof Object)) {
    return value
  } else if (Array.isArray(value)) {
    return value.map(item => deepMapObjectKeys(item, f))
  } else {
    return Object.keys(value).reduce((acc, key) => {
      if (!_.includes(RoleArray, key)) {
        acc[f(key)] = deepMapObjectKeys(value[key], f)
        return acc
      }
      acc[key] = value[key]
      return acc
    }, {})
  }
}
export const convertObjectToSnakeCase = requestBody => {
  // Converting to JSON and back first handles things like dates, circular references etc.
  if (requestBody) {
    requestBody = JSON.parse(JSON.stringify(requestBody))
    return deepMapObjectKeys(requestBody, snakeCase)
  }
  return {}
}
export const convertObjectToCamelCase = responseBody =>
  deepMapObjectKeys(responseBody, camelCase)

export declare type NullableList = 'items' | 'itemsAndList'

export const NullableTrue: FieldOptions = {
  nullable: true,
  description: '<No Description, Override manually>',
  complexity: 5,
}

export const NullableFalse: FieldOptions = {
  nullable: false,
  description: '<No Description, Override manually>',
  complexity: 5,
}

export interface FieldOptions {
  name?: string
  description: string
  deprecationReason?: string
  complexity?: Complexity
  middleware?: FieldMiddleware[]
  nullable: boolean | NullableList
  defaultValue?: any
}

interface IAbstract {
  isAbstract: boolean
}
export const AbstractTrue: IAbstract = { isAbstract: true }
export const AbstractFalse: IAbstract = { isAbstract: false }

export const deleteDynamoDBKeys = (keys: any, args: any) => {
  /*
  const args = ['gsi1', 'gsi2']
  const keys = {
     'gsi1': '',
     'gsi2': '',
     'pk': ''
 }
  */
  for (const key in keys) {
    args.forEach((element: any) => {
      if (key === element) {
        delete keys[element]
      }
    })
  }
}

export const extractUUIDFromString = (str: string) => {
  // uuid v4 version
  const regx = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
  let uuid = ''
  try {
    uuid = regx.exec(str)[0]
  } catch (e) {
    throw e
  }
  return uuid
}

export const getIdFromString = (data: any, key: Keys) => {
  let d = ''
  if (data?.[key]) {
    d = extractUUIDFromString(data?.[key])
  }
  return d
}

export function getObject<R>(C: new (...P: any) => R, I: any): R {
  return new C({ ...I })
}

export const AttributesOf = <TObj>(_obj?: TObj) =>
  new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw Error('Set not supported')
      },
    },
  ) as {
    [P in keyof TObj]?: P
  }
/*
 const myInterfaceProperties = AttributesOf<CumulativeSchema>();
    console.log(myInterfaceProperties.cumulative_area)
    */

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

export const getTemplate = async (
  templateName: string,
  renderingObject: any,
  isLocal: boolean = false,
) => {
  let pathNew = ''
  if (isLocal /*locally testing */) {
    pathNew = path.join(path.resolve(__dirname), `../../views`, `${templateName}.ejs`)
  } else {
    pathNew = path.join(path.resolve(__dirname), `views`, `${templateName}.ejs`)
  }
  const htmlContent = fs.readFileSync(pathNew, 'utf8')
  const template = ejs.compile(htmlContent)
  return template(renderingObject)
  // Example use case.
  // await getTemplate('ui', { title: 'EJS Detrojs' })
}

export const AgreementDocTimestamp = 'MM-DD-YYYY HH:mm:ss'

export const validaAndFormatDateString = (str: string): string => {
  const resp = moment(str).format(AgreementDocTimestamp)
  if (resp.includes('Invalid date')) {
    logger.error(`Provided date is not valid format ${str}`)
    throw new BaseError(
      HttpStatus.BAD_REQUEST,
      `Provided date is not valid format ${str}`,
    )
  }
  return resp
}

export const IS_CAMEL_CASE = true

export const generateReferralCode = async (_user_id?: string) => {
  const code = referralCodes.generate({
    charset: referralCodes.charset(referralCodes.Charset.ALPHANUMERIC),
    length: 12,
    count: 1,
  })
  return code[0]
  /* try {
    let hash = crypto.createHash('sha256').update(user_id).digest('base64')
    if (dyanamic) {
      const len = 16
      const charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}!@#$%^&*()~!@+'
      let retVal = ''
      for (let i = 0, n = charset.length; i < len; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
      }
      hash = crypto.createHash('sha256').update(`${user_id}${retVal}`).digest('base64')
    }
    return hash
    // ReferrerCode, ReferreCode, ReferralLInk
  } catch (e) {
    logger.error(JSON.stringify(e))
    throw e
  } */
}

export const processEmptyListOrObject = (resp: object) => {
  if (_.isUndefined(resp) || _.isEmpty(resp)) {
    throw new EmptyObjectError()
  }
  if (_.size(resp) === 0) {
    throw new EmptyListError()
  }
}

// Input is date and different
export const getDateDiffInMonths = (inputDate: string) => {
  const inputDateFormatted = moment(inputDate, AgreementDocTimestamp)
  const today = new Date().toISOString()
  const tf = moment(today).format(AgreementDocTimestamp)
  const todayFormatted = moment(tf, AgreementDocTimestamp)
  const diffMonth = todayFormatted.diff(inputDateFormatted, 'months')
  /*
 "year" | "years" | "y" |
      "month" | "months" | "M" |
      "week" | "weeks" | "w" |
      "day" | "days" | "d" |
      "hour" | "hours" | "h" |
      "minute" | "minutes" | "m" |
      "second" | "seconds" | "s" |
      "millisecond" | "milliseconds" | "ms"
  */
  if (_.isNaN(diffMonth) || _.isUndefined(diffMonth)) {
    throw new BaseError(HttpStatus.BAD_REQUEST, 'Invalid input date.')
  }
  return diffMonth
}

export const FILE_TYPE_ALLOWED = /\.(gif|jpe?g|tiff?|png|bmp)$/i
export const FILE_TYPE_ALLOWED_2 = /\.(gif|jpe?g|tiff?|webp|png|bmp)$/i

export const skipNullAttributes = attributes => {
  return _.omitBy(attributes, attr => {
    if (attr === null) return true
    return _.isNull(attr.Value)
  })
}
export function removeEmptyFromObject(obj: any): any {
  const finalObj = {}
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nestedObj = this.removeEmpty(obj[key])
      if (Object.keys(nestedObj).length) {
        finalObj[key] = nestedObj
      }
    } else if (Array.isArray(obj[key])) {
      if (obj[key].length) {
        obj[key].forEach((x: any) => {
          const nestedObj = this.removeEmpty(x)
          if (Object.keys(nestedObj).length) {
            finalObj[key] = finalObj[key] ? [...finalObj[key], nestedObj] : [nestedObj]
          }
        })
      }
    }
    // Check if you need to have reset the attribute or not.
    else if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
      finalObj[key] = obj[key]
    }
  })
  return finalObj
}
export const LogInfo = (...args: any[]) => {
  logger.info(args.map(e => JSON.stringify(e, null, 4)).join('\n'))
}

export const LogWarn = (...args: any[]) => {
  logger.warn(args.map(e => JSON.stringify(e, null, 4)).join('\n'))
}

export const LogError = (...args: any[]) => {
  logger.error(args.map(e => JSON.stringify(e, null, 4)).join('\n'))
}

export const lambdaTimeout = async ({ time, ...rest }) =>
  new Promise((resolve, _reject) =>
    setTimeout(() => {
      resolve(`${rest.message} (with a delay)`)
    }, time * 1000),
  )

// const isSameUser = (a, b) => a.value === b.value && a.display === b.display;
export const isSameUser = (a: any, b: any) => a.identifier === b.identifier
// Get items that only occur in the left array,
// using the compareFunction to determine equality.
export const onlyInLeft = (left: any, right: any, compareFunction: any) =>
  left.filter(
    leftValue => !right.some(rightValue => compareFunction(leftValue, rightValue)),
  )

export const checkImageUrl = async (url: string) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        if (res.statusCode === 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .on('error', err => {
        reject(err)
      })
  })
}

// Example Usages
// checkImageUrl('https://example.com/image.jpg')
//   .then((isValid) => {
//     console.log(`The image URL is ${isValid ? 'valid' : 'invalid'}.`);
//   })
//   .catch((err) => {
//     console.error(`Error checking image URL: ${err}`);
//   });

export const sleep = (waitTimeInMs: number) =>
  new Promise(resolve => setTimeout(resolve, waitTimeInMs))

export const uniqueArray = (csvResultData: any) => {
  const result = csvResultData?.filter(
    (obj, index, self) =>
      index ===
      self.findIndex(o => o.uniquAttrbuteToCompare === obj.uniquAttrbuteToCompare),
  )
  return result
}

export const IsValid = (input: any) => {
  if (
    typeof input === 'object' &&
    (_.isUndefined(input) ||
      _.isNull(input) ||
      _.isEmpty(input) ||
      (_.isBoolean(input) && !input) ||
      (_.isString(input) && _.isEmpty(input)))
  ) {
    return false
  } else if (Array.isArray(input)) {
    if (input.length === 0) {
      return false
    }
  }
  return true
}
