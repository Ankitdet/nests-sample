import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { JSONObjectScalar } from '@shared/scalar/json.scalar'
import { ChainalysisModule } from '../chainalysis/chainalysis.module'
import { AlchemyModule } from '../integration/blockchain/blockchain.module'
import { UsersController } from './user.controller'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [HttpModule, AppResolver, AlchemyModule, ChainalysisModule],
  providers: [UserService, UserResolver, JSONObjectScalar],
  exports: [UserService, UserResolver],
  controllers: [UsersController],
})
export class UserModule {}
