import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { CheckoutModule } from '../checkout/checkout.module'
import { AlchemyModule } from '../integration/blockchain/blockchain.module'
import { AWSSqsService } from './aws-sqs.service'

@Module({
  imports: [HttpModule, AlchemyModule, CheckoutModule],
  providers: [AWSSqsService],
  exports: [AWSSqsService],
  controllers: []
})
export class AWSSqsModule { }
