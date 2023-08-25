import { getRouterName, RouterName } from '@core/enums/router-name.enum'
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { RestHostName } from '@shared/decorators/hostname.decorator'
import { Roles } from '@shared/decorators/role.decorator'
import { BaseError } from '@shared/errors'
import { Request } from 'express'
import { logger } from '../../shared/logger/logger'
import { WebhookService } from './webhook.service'

@Controller(getRouterName(RouterName.webhooks))
@Roles(['Public'])
export class WebhookController {
  constructor(
    public readonly webhookService: WebhookService, // private readonly coinifyService: CoinifyService,
  ) {}
  @Post('onfido/status')
  @HttpCode(200)
  async findAll(@Body() onfidoResponse: any): Promise<string> {
    logger.info('Inside the Ondifo status.')
    try {
      await this.webhookService.updateOnfidoKYCStatus(onfidoResponse?.payload)
    } catch (e) {
      logger.error('Getting error while calling the webhook service.', e)
      throw new BaseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'problem while calling the webhook service.',
      )
    }
    return 'webhook called'
  }

  @Post('stripe/status')
  @HttpCode(200)
  async processStripeResponse(
    @Body() requestBody: any,
    @Req() request: Request,
    @RestHostName() hostname: any,
  ) {
    logger.info(hostname)
    await this.webhookService.updateStripeOrder(requestBody, request, hostname)
    return 'stripe webhook called'
  }

  @Post('coinify/status')
  async processCoinifyResponse(@Body() requestBody: any) {
    logger.info('Inside the Coinify webhook called.', JSON.stringify(requestBody))
    try {
      await this.webhookService.updateCoinifyOrder(requestBody)
    } catch (e) {
      logger.error('Getting error while calling the webhook service.', e)
      throw new BaseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'problem while calling the webhook service.',
      )
    }
    return 'coinify webhook called'
  }

  @Post('pandadoc/status')
  async processPandaDocResponse(@Body() requestBody: any) {
    logger.info(`Processing Panda doc Response: ${JSON.stringify(requestBody)}`)
    try {
      await this.webhookService.receivePandaDocEvent(requestBody)
    } catch (e) {
      logger.error(
        `Getting error while performing processPandaDocResponse. ${JSON.stringify(e)}`,
      )
      throw new BaseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Getting error while performing processPandaDocResponse.',
      )
    }
    return 'processing pandadoc events'
  }

  @Post('pandadoc/document/status')
  async processDocumentChangeEvent(@Body() requestBody: any) {
    logger.info(`Processing processDocumentChangeEvent: ${JSON.stringify(requestBody)}`)
    try {
      await this.webhookService.receiveDocumentChangeEvent(requestBody)
    } catch (e) {
      logger.error(
        `Getting error while performing processDocumentChangeEvent. ${JSON.stringify(
          e,
        )}`,
      )
      throw new BaseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Getting error while performing processDocumentChangeEvent.',
      )
    }
    return 'processing processDocumentChangeEvent'
  }
}
