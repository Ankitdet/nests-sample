import { NODE_ENV, STAGE } from '@const/environments'
import { Environments } from '@core/enums'
import { createParamDecorator, HttpStatus } from '@nestjs/common'
import { BaseError } from '@shared/errors'

export const ExecuteForDevOnly = createParamDecorator(() => {
  if (STAGE !== Environments.DEV) {
    throw new BaseError(
      HttpStatus.METHOD_NOT_ALLOWED,
      'Not allowed method in ' + NODE_ENV + ' enviroment',
    )
  }
})

export const ExecuteForLocalOnly = createParamDecorator(() => {
  if (STAGE === Environments.PROD || STAGE === Environments.STAGE) {
    throw new BaseError(
      HttpStatus.METHOD_NOT_ALLOWED,
      'Not allowed in ' + STAGE + ' enviroment',
    )
  }
})
