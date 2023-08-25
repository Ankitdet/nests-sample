import { Body, Controller, Post, Req } from '@nestjs/common'
import { Roles } from '@shared/decorators/role.decorator'
import { Request } from 'express'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Controller('user')
@Roles(['Public'])
export class UsersController {
  constructor(
    public readonly usersService: UserService,
    public readonly userResolver: UserResolver,
  ) {}

  @Post('verifyCaptch')
  async verifyCaptch(
    @Body() _onfidoResponse: any,
    @Req() req: Request,
  ): Promise<boolean> {
    return this.usersService.verifyCaptch(req)
  }
}
