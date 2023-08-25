import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ChainalysisResolver } from './chainalysis.resolver'
import { ChainalysisService } from './chainalysis.service'

@Module({
  imports: [HttpModule, AppResolver],
  providers: [ChainalysisResolver, ChainalysisService],
  exports: [ChainalysisService],
})
export class ChainalysisModule {}
