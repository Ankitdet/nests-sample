import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { validaAndFormatDateString } from '@utils/index'
import { errorMessages } from '../errors'
import { logger } from '../logger/logger'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    if (host['contextType'] === 'http') {
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR

      const responseBody = {
        status: httpStatus,
        title: exception?.['title'] || exception?.['name'] || exception?.['message'],
        description: errorMessages[httpStatus],
        issues:
          exception?.['response'] || exception?.['issues'] || exception?.['stack'],
        timestamp: validaAndFormatDateString(new Date().toISOString()),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      }
      logger.error({ error: `RestError: ${JSON.stringify(responseBody)}` })
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
    }
  }
}
