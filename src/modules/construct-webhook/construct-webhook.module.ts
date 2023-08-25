import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConstructWebhookController } from './construct-webhook.controller'
import { ConstructWebhookService } from './construct-webhook.service'

@Module({
  imports: [HttpModule, AppResolver],
  providers: [ConstructWebhookService],
  controllers: [ConstructWebhookController],
  exports: [ConstructWebhookService],
})
export class WebhookModule {}
