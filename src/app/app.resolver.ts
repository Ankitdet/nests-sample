import { Role } from '@core/enums/role.enum'
import { Roles } from '@shared/decorators/role.decorator'

@Roles([Role.Visitor, Role.Buyer, Role.Admin, Role.PropertyManager, Role.Seller])
export class AppResolver {}
