import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { validaAndFormatDateString } from '@utils/index'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { logger } from '../logger/logger'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    logger.info('interceptor is calling')
    let method = ''
    let url = ''
    let operation = ''
    let fieldName = ''
    let inputs = ''
    // check if request is coming from graphql or REST API
    if (context.switchToHttp().getRequest() != null) {
      method = context.switchToHttp().getRequest().method
      url = context.switchToHttp().getRequest().url
      operation = null
      fieldName = null
    } else {
      // if request is graphql
      inputs = context.getArgs()[1] || null
      method = context.getArgs()[2].req.method || null
      url = context.getArgs()[2].req.url || null
      operation = context.getArgs()[3].operation.operation || null
      fieldName = context.getArgs()[3].fieldName || null
    }
    const json = {
      input: JSON.stringify(inputs),
      method,
      path: url,
      operation,
      fieldName,
      date: validaAndFormatDateString(new Date().toISOString()),
    }
    logger.info(`GRAPHQL_REQUEST:${JSON.stringify(json)}`)
    return next.handle().pipe(tap())
  }
}
