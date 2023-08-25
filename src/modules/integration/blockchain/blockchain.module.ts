import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AppResolver } from '../../../app/app.resolver'
import { BlockchainResolver } from './blockchain.resolver'
import { BlockchainService } from './blockchain.service'

@Module({
  imports: [HttpModule, AppResolver],
  providers: [BlockchainResolver, BlockchainService],
  exports: [BlockchainResolver, BlockchainService],
})
export class AlchemyModule {}
