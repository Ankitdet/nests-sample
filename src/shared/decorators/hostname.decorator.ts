import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

// GRaphQL API
export const HostName = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req?.headers?.host
  },
)

// Rest API
export const RestHostName = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    Logger.log(data)
    const request = ctx.switchToHttp().getRequest()
    return request.res?.req?.headers?.host
  },
)
