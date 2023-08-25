import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { CheckoutModule } from '../../checkout/checkout.module'
// import { CheckoutService } from '../../checkout/checkout.service'
import { CoinifyResolver } from './coinify.resolver'
import { CoinifyService } from './coinify.service'

@Module({
  imports: [HttpModule, CheckoutModule],
  providers: [CoinifyService, CoinifyResolver],
  exports: [CoinifyService],
})
export class CoinifyModule {}
