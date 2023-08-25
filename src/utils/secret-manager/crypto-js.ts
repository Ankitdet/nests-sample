import CryptoJS from 'crypto-js'
import _ from 'lodash'
import { LogError, LogInfo } from '..'

const SALT =
  '$2y$10$TXlTYWx0VGhhdFVz07dbb6e6832da0841dd79701200e4b179f1a94a7b3dd26f612817f3c03117434ZXNBT'

export const encrypt = function (text: string): string {
  try {
    const result = CryptoJS.AES.encrypt(text, SALT)
    return result.toString()
  } catch (e) {
    LogError(e)
  }
}
export const decrypt = function (text: string) {
  try {
    const result = CryptoJS.AES.decrypt(text, SALT)
    const res = result.toString(CryptoJS.enc.Utf8)
    return res
  } catch (e) {
    LogError(e)
  }
}

export const encyptDecrypt = (secretString: string): any => {
  const secrets = JSON.parse(secretString)
  LogInfo('secrets', secrets)
  const json = {}
  const keys = Object.keys(secrets)
  for (let i = 0; i < keys.length; i++) {
    const d = decrypt(secrets[keys[i]])
    if (_.isEmpty(d)) {
      const e = encrypt(secrets[keys[i]])
      json[keys[i]] = e
    } else {
      const e = encrypt(d)
      json[keys[i]] = e
    }
  }
  LogInfo('Encrypt Key/Value Pair', json)
  return json
}

export const decrptFromSecret = (secretString: string): any => {
  const secrets = JSON.parse(secretString)
  LogInfo('decrptFromSecret:', secrets)
  const json = {}
  const keys = Object.keys(secrets)
  for (let i = 0; i < keys.length; i++) {
    const e = decrypt(secrets[keys[i]])
    json[keys[i]] = e
  }
  LogInfo('Decrpt Key/Value Pair', json)
  return json
}
