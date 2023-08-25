import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { CheckoutModule } from '../../checkout/checkout.module'
import { CoinifyModule } from '../coinify/coinify.module'
import { StripeResolver } from './stripe.resolver'
import { StripeService } from './stripe.service'

@Module({
  imports: [HttpModule, AppResolver, CheckoutModule, CoinifyModule],
  providers: [StripeService, StripeResolver],
  exports: [StripeService],
})
export class StripeModule {}
