import { HttpStatus } from '@nestjs/common'
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util'
import { OnfidoApiError } from '@onfido/api'
import { UserInputError } from 'apollo-server-errors'
import { GraphQLResponse } from 'apollo-server-types'
import { AxiosError, AxiosHeaders, isAxiosError } from 'axios'
import { GraphQLError } from 'graphql'
import _ from 'lodash'
import { logger } from '../logger/logger'
import { commonStatusMessages, errorMessages } from './statusCode.utils'

export class OnfidoError extends Error {
  public readonly name: string
  public readonly issues: any
  public readonly status: number
  public readonly title: string

  constructor(data: any) {
    super()
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'OnfidoApiError'
    this.status = Number(data?.statusCode) || data?.statusCode
    this.title = data?.type
    if (!_.isEmpty(data?.fields)) {
      this.issues = data?.fields
    } else {
      this.issues = data?.message
    }

    Error.captureStackTrace(this)
  }
}

export class BaseError extends Error {
  public readonly name: string
  public readonly status: ErrorHttpStatusCode
  public readonly title: string
  public readonly description: string
  public readonly issues: string

  constructor(httpCode: ErrorHttpStatusCode, description: string) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = 'BaseError'
    this.status = httpCode
    this.title = commonStatusMessages[httpCode]
    this.description = errorMessages[httpCode] || 'error while getting status code.'
    this.issues = description || null

    Error.captureStackTrace(this)
  }
}

export class EmptyListError extends Error {
  public readonly name: string
  private readonly EmptyListError = 'EmptyListError'
  constructor() {
    super()
    this.name = this.EmptyListError
    Error.captureStackTrace(this)
  }
}

export class EmptyObjectError extends Error {
  public readonly name: string
  private readonly EmptyObjectError = 'EmptyObjectError'
  constructor() {
    super()
    this.name = this.EmptyObjectError
    Error.captureStackTrace(this)
  }
}

export const responseFormat = (graphql_response: GraphQLResponse) => {
  const message = graphql_response?.errors?.[0]?.message
  if (message === 'EmptyListError') {
    delete graphql_response?.errors
    graphql_response.data = []
  } else if (message === 'EmptyObjectError') {
    delete graphql_response?.errors
    graphql_response.data = {}
  }
}

function formatAxiosError(e: AxiosError): AxiosError {
  const newError = new AxiosError(e.message, e.code, {
    headers: e.config?.headers,
    maxBodyLength: e.config?.maxBodyLength,
    maxContentLength: e.config?.maxContentLength,
    method: e.config?.method,
    params: e.config?.params,
    timeout: e.config?.timeout,
    url: e.config?.url,
  })
  if (e?.request) {
    newError.request = {
      data: e.request?.data,
      headers: e.request?.headers as AxiosHeaders,
      method: e.request?.method,
      path: e.request?.path,
    }
  }

  if (e.response) {
    newError.response = {
      config: undefined,
      data: e.response?.data,
      headers: e.response?.headers as AxiosHeaders,
      status: e.response?.status,
      statusText: e.response?.statusText,
    }
  }
  newError['cause'] = e['cause']
  newError['durationMs'] = e?.['durationMs']
  newError['stack'] = e['stack']
  return newError
}

export const formatErrorsAndIssues: GraphQLError | any = (err: any) => {
  logger.error({ error: `GRAPHQL_FORMATTED_ERROR: ${JSON.stringify(err)}` })
  if (isAxiosError(err)) {
    return formatAxiosError(err)
  }
  // Return Empty List
  if (err?.extensions?.exception?.name === 'EmptyListError') {
    return {
      message: 'EmptyListError',
    }
  }
  // Return Empty Object
  if (err?.extensions?.exception?.name === 'EmptyObjectError') {
    return {
      message: 'EmptyObjectError',
    }
  }

  // Bad Input
  if (
    err?.extensions?.code === 'BAD_USER_INPUT' ||
    err?.name === 'UserInputError' ||
    err instanceof UserInputError
  ) {
    return {
      status: HttpStatus.BAD_REQUEST || err?.extensions?.response?.['statusCode'],
      title:
        commonStatusMessages[HttpStatus.BAD_REQUEST] ||
        err?.extensions?.response?.['error'],
      description:
        errorMessages[HttpStatus.BAD_REQUEST] ||
        errorMessages[err?.extensions?.response?.['statusCode']],
      issues: err?.extensions?.response
        ? err?.extensions?.response?.message
        : err?.message,
    }
  }

  // Base Error
  if (err?.extensions?.exception?.name === 'BaseError' || err instanceof BaseError) {
    return {
      status: err?.extensions?.exception?.['status'],
      title: err?.extensions?.exception?.['title'],
      description: errorMessages[err?.extensions?.exception?.['status']],
      issues: err?.extensions?.exception?.issues || null,
    }
  }

  if (
    err?.extensions?.exception?.name === 'OnfidoApiError' ||
    err instanceof OnfidoApiError
  ) {
    return {
      status: err?.extensions?.exception?.['status'],
      title: err?.extensions?.exception?.['title'],
      description: errorMessages[err?.extensions?.exception?.['status']],
      issues: err?.extensions?.exception?.issues || null,
    }
  }

  // any unknown error (for e,g mongoerror/dynamodb, or some unhandled error.)
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    title: commonStatusMessages[HttpStatus.INTERNAL_SERVER_ERROR],
    description: errorMessages[HttpStatus.INTERNAL_SERVER_ERROR],
    issues: err?.message,
  }
}
