import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AWSSesService } from './aws-ses.service'

@Module({
  imports: [HttpModule],
  providers: [AWSSesService],
  exports: [AWSSesService],
})
export class AWSSesModule {}
