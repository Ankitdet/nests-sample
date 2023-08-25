import { AppResolver } from '@app/app.resolver'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { DateScalar } from '@shared/scalar/date.scalar'
// import { APP_GUARD, Reflector } from '@nestjs/core'
// import { RolesGuard } from '../../../shared/gaurds/roles.guard'
import { OnfidoResolver } from './onfido.resolver'
import { OnfidoSevice } from './onfido.service'

@Module({
  imports: [HttpModule, AppResolver],
  providers: [
    /*  {
       provide: APP_GUARD,
       useClass: RolesGuard,
       inject: [Reflector],
     }, */
    /*  {
       provide: APP_INTERCEPTOR,
       useClass: ResponseHeaderInterceptor,
     }, */
    OnfidoResolver,
    OnfidoSevice,
    DateScalar,
  ],
  exports: [OnfidoSevice],
})
export class OnfidoModule {}
