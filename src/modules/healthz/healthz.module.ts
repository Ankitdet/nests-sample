import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthResolver } from './healthz.resolver'

@Module({
  imports: [TerminusModule, HttpModule, AppResolver],
  providers: [HealthResolver],
})
export class HealthModule {}
