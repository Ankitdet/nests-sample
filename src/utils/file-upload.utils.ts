import { HttpStatus } from '@nestjs/common'
import { BaseError, errorMessages } from '@shared/errors'
import { FILE_TYPE_ALLOWED_2 } from '.'

export const imageFileFilter = async (file: any) => {
  if (!file.match(FILE_TYPE_ALLOWED_2)) {
    throw new BaseError(HttpStatus.NOT_FOUND, errorMessages.error['FNF-001'])
  }
}
