import { tokenValidationNotRequiredFor } from '@const/common.const'
import { AWS_REGION, AWS_USER_POOLS_ID, NODE_ENV, STAGE } from '@const/environments'
import { Environments } from '@core/enums'
import { getRouterName, RouterName } from '@core/enums/router-name.enum'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import jwt from 'express-jwt'
import { expressJwtSecret } from 'jwks-rsa'
import _ from 'lodash'
import { logger } from '../logger/logger'

@Injectable()
export class CongitoAuthMiddleWare implements NestMiddleware {
  constructor() {
    // empty block
  }
  public use(_req: Request, _res: Response, next: Function) {
    if (STAGE === Environments.LOCAL || NODE_ENV === Environments.LOCAL) {
      next()
      return
    }
    const hostname = _req.res.req.headers.host
    logger.info(`hostname ${hostname}`)
    logger.info(`Stage is ${STAGE}`)
    if (
      _req?.originalUrl?.includes(getRouterName(RouterName.webhooks)) ||
      _req?.originalUrl?.includes(getRouterName(RouterName.user))
    ) {
      next()
      return
    }

    if (
      this.isRefresh(_req, _res, next) ||
      this.isTokenValidationRequired(_req, _res, next)
    ) {
      next()
      return
    }

    const issuer = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_USER_POOLS_ID}`
    jwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        cacheMaxEntries: 5, // Default value
        cacheMaxAge: 600000, // Defaults to 10m
        jwksUri: `${issuer}/.well-known/jwks.json`,
      }),
      issuer,
      algorithms: ['RS256'],
    })(_req, _res, err => {
      if (err) {
        logger.error(err)
        const status = err.status || 500
        const message = err.message || 'Sorry we were unable to process your request.'
        return _res.status(status).send({
          message,
        })
      }
      next()
    })
  }

  private isRefresh(req: Request, _res: Response, _next: Function): boolean {
    if (req.body['operationName'] === 'IntrospectionQuery') {
      return true
    }
  }

  private isTokenValidationRequired(
    req: Request,
    _res: Response,
    _next: Function,
  ): boolean {
    let isTrue: boolean = false
    let query = req?.body?.['query'] || req?.originalUrl // REST API
    query = query?.replace(/(\r\n|\n|\r)/gm, '')
    _.forEach(tokenValidationNotRequiredFor, function (aIncludedFiles, _sKey) {
      if (query.indexOf(aIncludedFiles) > 0) {
        isTrue = true
        return false
      }
    })
    if (isTrue) {
      return true
    }
  }
}

/*
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class CongitoAuthMiddleWare implements NestMiddleware {
  use(_req: Request, _res: Response, next: Function) {
    next()
    return
  }
}
 */
