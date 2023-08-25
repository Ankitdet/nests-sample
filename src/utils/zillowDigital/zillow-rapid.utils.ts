/// <reference path="../../core/interfaces/zillow-digital/zillow-re.interface.ts"/>

// import { RAPID_API_HOST, RAPID_API_KEY } from '@const/environments'
import { RAPID_API_HOST, RAPID_API_KEY } from '@const/environments'
import { axiosGet } from '@shared/base.http.service'
import { ErrorHandler } from '@shared/errors/axios-errors'
import { logger } from '@shared/logger/logger'
import { sleep } from '@utils/index'

export const zillowSearch = async (address: string): Promise<any> => {
  let errorResp = null
  let resp:
    | ZillowReNameSpace.ZillowDigital
    | [ZillowMultiplePropertiesNameSpace.ZillowMultiplePropertiesObj] = null
  try {
    await sleep(1000)
    resp = await axiosGet(`https://${RAPID_API_HOST}/search`, {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST,
      },
      params: {
        location: address,
      },
    })
  } catch (e) {
    errorResp = ErrorHandler(e, 'Error while fetching zillow properties')
  } finally {
    logger.info('Completed zillowSearch function.')
  }
  return errorResp || resp
}

export const zestimateHistory = async (
  zpid: string,
): Promise<[ZestimateHistoryNameSpace.ZestimateHistory]> => {
  let resp = null
  try {
    await sleep(1000)
    resp = await axiosGet(`https://${RAPID_API_HOST}/zestimate_history`, {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST,
      },
      params: {
        zpid: `${zpid}`,
      },
    })
  } catch (e) {
    resp = ErrorHandler(e, `Error while fetching zestimateHistory  ${zpid}`)
  }
  return resp
}

export const photos = async (zpid: string): Promise<any> => {
  let resp = null
  try {
    await sleep(1000)
    resp = await axiosGet(`https://${RAPID_API_HOST}/photos`, {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST,
      },
      params: {
        zpid: `${zpid}`,
      },
    })
  } catch (e) {
    resp = ErrorHandler(e, `Error while fetching zestimateHistory  ${zpid}`)
  }
  return resp
}
