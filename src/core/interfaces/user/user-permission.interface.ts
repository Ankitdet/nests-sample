import { Role } from '@utils/index'

export type IUserPermision = {
  home?: boolean
  marketplace?: boolean
  re_listing?: boolean
  profile?: boolean
  kyc_status?: boolean
  blockchain_address?: boolean
  firstname?: boolean
  lastname?: boolean
  password_reset?: boolean
  re_detail?: boolean
}

export type IUserPermisionResponse = {
  home?: boolean
  marketplace?: boolean
  profile?: boolean
  firstname?: boolean
  lastname?: boolean
  reListing?: boolean
  kycStatus?: boolean
  blockchainAddress?: boolean
  passwordReset?: boolean
  reDetail?: boolean
}

export type CongnitoRolePermissionType = {
  [key in Role]?: IUserPermision
}

export type IUserRolePermission = {
  role: [Role]
  permission: IUserPermision
}

export type IRoleDB = {
  [key in Role]?: boolean
}
