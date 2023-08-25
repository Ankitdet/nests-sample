import { NODE_ENV, PORT } from '@const/environments'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { useContainer } from 'class-validator'
import express from 'express'
import { join } from 'path'
import { AppModule, setAppConfig } from './app/app.module'
import { Environments } from './core/enums'
import { logger } from './shared/logger/logger'
import { LogError, LogInfo } from './utils'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    cors: true,
    logger: false,
  })
  if (NODE_ENV === Environments.LOCAL) {
    app.useStaticAssets(join(__dirname, '..', 'static'))
  }
  express.raw({
    type: '*/*',
  })
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  setAppConfig(app)
  await app.listen(PORT)
  return app
}

process.on('unhandledRejection', err => {
  // Handle the error safely
  LogError(err)
})

process.on('uncaughtException', function (err) {
  // Handle the error safely
  LogError(err)
})

bootstrap()
  .then(async app => {
    LogInfo(`3blocks.io is running on ${await app.getUrl()}`)
  })
  .catch(err => {
    logger.error(`error while 3blocks.io running...`, err)
    throw err
  })

/*
TODO
ValidationArgs
https://medium.com/@maksim_smagin/reusable-validation-in-nestjs-986e8a2c59c3

*/
