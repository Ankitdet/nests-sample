import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { BaseError } from '../errors'
import { logger } from '../logger/logger'

@Injectable()
export class ResponseHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        // This interceptor will call after every request expect not called when any error occured
        logger.info('last me called.')
        const ctx = GqlExecutionContext.create(context)
        const res = ctx.getContext().res
        res.header('foo', 'bar')
      }),
      catchError(err => {
        logger.error({ error: err })
        throw new BaseError(
          HttpStatus.NOT_ACCEPTABLE,
          'getting error while settin response header.',
        )
      }),
    )
  }
}
