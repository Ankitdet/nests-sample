import {
  getRealEstateBasicInfoById,
  PropertyInfoDynamo,
} from '@db/real-estate/real-estate.db'
import { HttpStatus } from '@nestjs/common'
import { BaseError } from '@shared/errors'
import _ from 'lodash'

export const isRealEstateBasicDataFound = async (re_id: string) => {
  const propInfo = new PropertyInfoDynamo({
    re_id,
  })
  const existingRe = await getRealEstateBasicInfoById(propInfo)
  if (!existingRe || _.isEmpty(existingRe)) {
    throw new BaseError(
      HttpStatus.NOT_FOUND,
      `Real estate not found for given re_id : ${re_id}`,
    )
  }
}
