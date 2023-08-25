import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { generateProjectionQueryFromReq } from '@utils/index'
import { GraphQLObjectType } from 'graphql'

export const QueryFromRequest = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const query = getResponseFields(ctx)
    Logger.log(`QueryFromRequest : ${JSON.stringify(query)}`)
    const res = generateProjectionQueryFromReq(query)
    return res
  },
)

const getResponseFields = (contx: GqlExecutionContext) => {
  const args = contx['args']?.[3]
  const obj = args['returnType']?.['ofType']?.['_fields']
  return flattenObj(obj, '')
}

function flattenObj(obj: any, parentObjKey: string, res = {}) {
  for (const key in obj) {
    const propName = parentObjKey ? parentObjKey + '.' + key : key
    const innerObj = obj[key]
    if (innerObj.type instanceof GraphQLObjectType) {
      const innerObjFields = innerObj?.type?._fields
      flattenObj(innerObjFields, propName, res)
    } else {
      res[propName] = 1
    }
  }
  return res
}
