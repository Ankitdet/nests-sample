import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { RealEstateResolver } from './real-estate.resolver'
import { RealEstateService } from './real-estate.service'

@Module({
  imports: [HttpModule, AppResolver],
  providers: [RealEstateResolver, RealEstateService],
})
export class RealEstateModule {}
