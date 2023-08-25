import { AppResolver } from '@app/app.resolver'
import { Module } from '@nestjs/common'
import { S3Resolver } from './s3-buckets.resolver'

@Module({
  imports: [AppResolver],
  providers: [S3Resolver],
})
export class S3Module {}
