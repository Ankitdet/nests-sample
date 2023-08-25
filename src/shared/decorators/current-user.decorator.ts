import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user
    let users = {}
    if (!user) {
      users = {
        email: 'fakeid@gmail.com',
        sub: '5a5cbd89-4ba8-48c8-8060-e2f1aea7f2f7',
      }
      return users
    }
    return user
  },
)
