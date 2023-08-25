import { getRouterName, RouterName } from '@core/enums/router-name.enum'
import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { Roles } from '@shared/decorators/role.decorator'
import { BaseError } from '@shared/errors'
import { logger } from '@shared/logger/logger'
import { ConstructWebhookService } from '../construct-webhook/construct-webhook.service'

@Controller(getRouterName(RouterName.constructWebhook))
@Roles(['Public'])
export class ConstructWebhookController {
  constructor(public readonly constructWebhookService: ConstructWebhookService) { }
  @Post('/onfido')
  async findAll(@Body() onfidoResponse: any): Promise<string> {
    logger.info('Inside the Ondifo status.')
    try {
      await this.constructWebhookService.updateOnfidoKYCStatus(onfidoResponse?.payload)
    } catch (e) {
      logger.error('Getting error while calling the webhook service.', e)
      throw new BaseError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'problem while calling the webhook service.',
      )
    }
    return 'webhook called'
  }
}


