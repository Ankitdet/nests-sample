import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { JSONObjectScalar } from '../../../shared/scalar/json.scalar'
import { BitpayResolver } from './bitpay.resolver'
import { BitpayService } from './bitpay.service'

@Module({
  imports: [HttpModule],
  providers: [BitpayService, BitpayResolver, JSONObjectScalar],
  exports: [BitpayService],
})
export class BitpayModule {}
