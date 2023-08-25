import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AWSSesModule } from '../aws-ses/aws-ses.module'
import { AWSSqsModule } from '../aws-sqs/aws-sqs.module'
import { AlchemyModule } from '../integration/blockchain/blockchain.module'
import { PandaDocModule } from '../integration/panda-doc/panda-doc.module'
import { UserModule } from '../user/user.module'
import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'

@Module({
  imports: [
    HttpModule,
    AppResolver,
    AlchemyModule,
    PandaDocModule,
    AWSSqsModule,
    UserModule,
    AWSSesModule,
  ],
  providers: [WebhookService],
  controllers: [WebhookController],
  exports: [WebhookService],
})
export class WebhookModule {}
