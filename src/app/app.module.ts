import { NODE_ENV } from '@const/environments'
import {
  CacheInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common'
import { APP_FILTER, /* APP_GUARD */ APP_PIPE /* Reflector */ } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { formatErrorsAndIssues, responseFormat } from '@shared/errors'
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter'
// import { RolesGuard } from '../shared/gaurds/roles.guard'
import { LoggingInterceptor } from '@shared/interceptor'
import { logger } from '@shared/logger/logger'
import { CongitoAuthMiddleWare } from '@shared/middleware/cognito.middleware'
import { CustomValidationPipe } from '@shared/pipe'
import { GraphQLRequestContext, GraphQLResponse } from 'apollo-server-types'
import { graphqlUploadExpress } from 'graphql-upload'
import { join } from 'path'
import { app } from '../modules/export-modules'
import { AppResolver } from './app.resolver'

declare const module: any
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile:
        NODE_ENV === 'local' ? join(process.cwd(), 'src/schema.gql') : true,
      debug: false,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
      cors: {
        credentials: true,
        origin: true,
      },
      formatResponse: (
        graphql_response: GraphQLResponse,
        _graphqlRequestContext: GraphQLRequestContext<object>,
      ): Record<string, any> => {
        if (!graphql_response?.data?.__schema) {
          logger.info(`GRAPHQL_RESPONSE: ${JSON.stringify(graphql_response?.data)}`)
          if (graphql_response?.errors)
            logger.error(`GRAPHQL_ERROR: ${JSON.stringify(graphql_response?.errors)}`)
        }
        responseFormat(graphql_response)
        return graphql_response
      },
      formatError: err => {
        return formatErrorsAndIssues(err)
      },
      playground: {
        endpoint:
          process.env.IS_NOT_SLS === 'true'
            ? '/graphql'
            : `/${process.env.STAGE}/graphql`,
      },
    }),
    ...app,
  ],
  controllers: [],
  providers: [
    AppResolver,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    /* {
      provide: APP_GUARD,
      useClass: RolesGuard,
      inject: [Reflector],
    }, */
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    Object.freeze(AppModule)
    consumer.apply(CongitoAuthMiddleWare).forRoutes({
      method: RequestMethod.POST,
      path: '/**',
    }).apply(CacheInterceptor).forRoutes({
      method: RequestMethod.POST,
      path: '/test'
    })
  }
}

// Common for lambda and main.ts
export const setAppConfig = (app: any) => {
  app.use(
    graphqlUploadExpress({
      maxFileSize: 400000000, // 20 mb
      maxFiles: 10, // 10 files
    }),
  )
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
  app.enableShutdownHooks()
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(
    new LoggingInterceptor() /* new ResponseHeaderInterceptor() */,
  )
}

// if transformOptions: { enableImplicitConversion: true } option is enabled, it converts string to number even without @Type(() => Number) decorator.
