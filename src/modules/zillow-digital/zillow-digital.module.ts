import { AppResolver } from '@app/app.resolver'
import { DataConverter } from '@core/converters/zillow.converter'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ZillowDigitalResolver } from './zillow-digital.resolver'
import { ZilloDigitalService } from './zilow-digital.service'

@Module({
  imports: [HttpModule, AppResolver],
  providers: [ZillowDigitalResolver, ZilloDigitalService, DataConverter],
  controllers: [],
  exports: [],
})
export class ZillowDigitalModule {}
