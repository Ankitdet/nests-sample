/*
--------------------------------------------------------------------
DEV
--------------------------------------------------------------------
REFFERAL_CODE_FEATURE : true

--------------------------------------------------------------------
STAG
--------------------------------------------------------------------
REFFERAL_CODE_FEATURE : false

--------------------------------------------------------------------
PROD
--------------------------------------------------------------------
REFFERAL_CODE_FEATURE : false

*/

export const FEATURE = {
  REFFERAL_CODE: Boolean(process.env.REFFERAL_CODE_FEATURE) || false,
  SECRET_MANAGER: Boolean(process.env.SECRET_MANAGER) || false,
}
