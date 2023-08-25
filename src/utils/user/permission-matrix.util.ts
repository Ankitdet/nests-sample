import {
  CongnitoRolePermissionType,
  IRoleDB,
  IUserRolePermission,
} from '@core/interfaces/user/user-permission.interface'
import { Role } from '..'

import admin from '@resources/permissions/admin.json'
import buyer from '@resources/permissions/buyer.json'
import pm from '@resources/permissions/pm.json'
import seller from '@resources/permissions/seller.json'
import visitor from '@resources/permissions/visitor.json'

const getRolePermission: CongnitoRolePermissionType = {
  [Role.Visitor]: visitor,
  [Role.Buyer]: buyer,
  [Role.Seller]: seller,
  [Role.Admin]: admin,
  [Role.PropertyManager]: pm,
}

export const getPermissionOf = (role: any): IUserRolePermission => {
  const permission: any = {}
  permission.permission = settingRole(role)
  const r: Role = role as Role
  permission.role = [r]
  return permission
}

const settingRole = (role: any) => {
  let permission = {}

  if (role === Role.Visitor) {
    permission = getRolePermission[Role.Visitor]
  }
  if (role === Role.Buyer) {
    permission = getRolePermission[Role.Buyer]
  }
  if (role === Role.Admin) {
    permission = getRolePermission[Role.Admin]
  }
  if (role === Role.PropertyManager) {
    permission = getRolePermission[Role.PropertyManager]
  }
  if (role === Role.Seller) {
    permission = getRolePermission[Role.Seller]
  }
  return permission
}
export const setRoleForDB = (role: Role): IRoleDB => {
  let roleSet = {
    [Role.Visitor]: false,
    [Role.Buyer]: false,
    [Role.Admin]: false,
    [Role.PropertyManager]: false,
    [Role.Seller]: false,
  }
  if (role === Role.Visitor) {
    roleSet = {
      ...roleSet,
      [Role.Visitor]: true,
    }
  } else if (role === Role.Buyer) {
    roleSet = {
      ...roleSet,
      [Role.Buyer]: true,
    }
  } else if (role === Role.Admin) {
    roleSet = {
      ...roleSet,
      [Role.Admin]: true,
    }
  } else if (role === Role.PropertyManager) {
    roleSet = {
      ...roleSet,
      [Role.PropertyManager]: true,
    }
  } else if (role === Role.Seller) {
    roleSet = {
      ...roleSet,
      [Role.Seller]: true,
    }
  }
  return roleSet
}
