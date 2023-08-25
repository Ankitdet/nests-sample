import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { UserModule } from '../../user/user.module'
import { PandaDocResolver } from './panda-doc.resolver'
import { PandaDocService } from './panda-doc.service'

@Module({
  imports: [HttpModule, AppResolver, UserModule],
  providers: [PandaDocResolver, PandaDocService],
  exports: [PandaDocResolver, PandaDocService],
})
export class PandaDocModule {}
