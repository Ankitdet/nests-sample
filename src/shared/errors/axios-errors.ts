import axios, { AxiosError } from 'axios'
import { logger } from '../logger/logger'

export function ErrorHandler(
  error: Error | AxiosError,
  message?: string,
  fn?: Function,
  moduleName?: string,
) {
  let errorObj = {}
  if (axios.isAxiosError(error)) {
    if (error?.response) {
      errorObj = {
        name: 'AxiosError',
        data: error?.response?.data,
        status: error?.response?.status,
        headers: error?.response?.headers,
        messsage: error?.response?.data?.message,
      }
    } else if (error?.request) {
      errorObj = {
        name: 'AxiosError',
        request: error.request,
        requestBody: error.request?.body ? error.request.body : error.config.data,
        fullPath: `${error.request?.options?.protocol}//${error.request?.options?.host}${error.request?.options?.path}`,
        queryParams: getQueryParams(error.request?.options?.search),
      }
    } else {
      errorObj = error
    }
  } else if (error instanceof Error) {
    errorObj = {
      name: 'error',
      error,
    }
  } else {
    errorObj = `can't handle error, please look manually.`
  }
  logger.error({
    moduleName,
    fn: fn?.name,
    error: `${message}, ${JSON.stringify(errorObj)}`,
  })
  return { error: errorObj }
}

export function ErrorHandleAndThrow(
  error: Error | AxiosError,
  message?: string,
  fn?: Function,
  moduleName?: string,
) {
  throw ErrorHandler(error, message, fn, moduleName)
}

function getQueryParams(params: any) {
  return Object.fromEntries(new URLSearchParams(params))
}
