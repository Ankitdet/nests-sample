/* import { Role } from '@core/enums'
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RoleValidationNotRequiredFor } from '@utils/router-validation'
import { getRole } from '@utils/user/user-role.utils'
import _ from 'lodash'
import { getCognitoUserDetail } from '../../dynamodb/users/users.db'

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger: Logger = null
  constructor(private readonly reflector: Reflector) {
    this.logger = new Logger(RolesGuard.name)
  }

  canActivate(_context: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve, _reject) => {
      this.logger.log('entering into roles')
      const ctx = GqlExecutionContext.create(_context)
      const user = ctx.getContext().req?.user
      const res = ctx.getContext().res

      // Return true for webhook handler
      let definedRole = this.reflector.get<any[]>('roles', _context.getClass())
      if (definedRole[0] === 'Public') {
        resolve(true)
        return
      }

      // validation
      const handlerName = ctx.getHandler().name
      Logger.log(RoleValidationNotRequiredFor)

      if (_.includes(RoleValidationNotRequiredFor, handlerName)) {
        resolve(true)
        return
      }

      try {
        const data = await getCognitoUserDetail(user?.['sub'])
        if (_.isEmpty(data)) {
          return res.status(400).send({
            message: 'User not found, create first.',
          })
        }
        const incoming_roles = getRole(data[0])
        definedRole = this.reflector.get<Role[]>('roles', _context.getClass())
        if (!definedRole) {
          return res.status(403).send({
            message: `Permission not defined for handler ${handlerName}`,
          })
        }
        let isTrue = false
        definedRole.forEach(role => {
          incoming_roles.forEach(element => {
            if (element === role) {
              isTrue = true
              return true
            }
          })
        })
        resolve(isTrue)
      } catch (e) {
        Logger.error(e)
        if (e?.['statusCode'] === 400) {
          return res.status(400).send({
            message: 'User not found, create first.',
          })
        }
        _reject(e)
      }
    })
  }
}
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(_context: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve, _reject) => {
      resolve(true)
      return
    })
  }
}
