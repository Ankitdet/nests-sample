import { Module } from '@nestjs/common'
import { AWSSesModule } from '../aws-ses/aws-ses.module'
import { AlchemyModule } from '../integration/blockchain/blockchain.module'
import { PandaDocModule } from '../integration/panda-doc/panda-doc.module'
import { CheckoutResolver } from './checkout.resolver'
import { CheckoutService } from './checkout.service'

@Module({
  imports: [AlchemyModule, AWSSesModule, PandaDocModule],
  providers: [CheckoutResolver, CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule { }
