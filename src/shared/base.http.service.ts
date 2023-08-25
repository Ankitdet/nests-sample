import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, Scope } from '@nestjs/common'
import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'
import { AuthenticationError } from 'apollo-server-errors'
import axios, { AxiosError } from 'axios'
import { from, lastValueFrom, map } from 'rxjs'
import { ErrorHandler } from './errors/axios-errors'
import { logger } from './logger/logger'

@Injectable({ scope: Scope.REQUEST })
export abstract class BaseHttpService {
  protected httpService: HttpService

  constructor(httpService: HttpService) {
    this.httpService = httpService
  }

  protected buildQueryString(searchCriteria: any): string {
    let queryString = ''
    Object.keys(searchCriteria).forEach(key => {
      if (searchCriteria[key]) {
        queryString += `${queryString.length ? '&' : '?'}${key}=${searchCriteria[key]}`
      }
    })
    return queryString
  }

  protected handleError(error, _message) {
    const errorResponse = error.message?.data
    switch (error.response?.status) {
      case 400:
        throw new BadRequestException(errorResponse)
      case 401:
        throw new AuthenticationError(errorResponse)
    }
  }

  protected async httpPost(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    return lastValueFrom(
      this.httpService.post(url, data, config).pipe(map(response => response.data)),
    ).catch(error => {
      logger.error(
        'Getting error while performint the create application operation',
        error,
      )
      throw new AxiosError(error)
    })
  }

  protected async httpGet(url: string, config?: AxiosRequestConfig): Promise<any> {
    return lastValueFrom(
      this.httpService.get(url, config).pipe(map(response => response.data)),
    ).catch(error => {
      // error?.isAxiosError
      // console.log(error?.response?.data)
      logger.error(
        'Getting error while performing the create application operation',
        error,
      )
      throw new AxiosError(error)
    })
  }

  protected async httpDelete(url: string, config?: AxiosRequestConfig): Promise<any> {
    return lastValueFrom(
      this.httpService.delete(url, config).pipe(map(response => response.data)),
    ).catch(error => {
      logger.error('Getting error while performing the delete operation.', error)
      throw new AxiosError(error)
    })
  }

  protected async httpPut(url: string, config?: AxiosRequestConfig): Promise<any> {
    return lastValueFrom(
      this.httpService.put(url, config).pipe(map(response => response.data)),
    ).catch(error => {
      // error?.isAxiosError
      // console.log(error?.response?.data)
      logger.error(
        'Getting error while performing the create application operation',
        error,
      )
      throw new AxiosError(error)
    })
  }
}

// non class function
export const axiosPut = async (
  url: string,
  config?: AxiosRequestConfig,
): Promise<any> => {
  try {
    return from(axios.put(url, config)).pipe(map(response => response.data))
  } catch (error) {
    logger.error(
      'Getting error while performing the create application operation',
      error,
    )
    throw new AxiosError(error)
  }
}

export const axiosPost = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<any> => {
  try {
    return axios.post(url, data, config).then(res => res.data)
  } catch (error) {
    ErrorHandler(error, 'Getting error while performing the post operation')
    throw error
  }
}

// non class function
export const axiosGet = async (
  url: string,
  config?: AxiosRequestConfig,
): Promise<any> => {
  try {
    return axios.get(url, config).then(response => response.data)
  } catch (error) {
    ErrorHandler(error, 'Getting error while performing the get operation')
    throw error
  }
}
