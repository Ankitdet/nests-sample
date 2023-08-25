import { Role } from '..'

export const getRole = (resp: any): any => {
  const r = []

  /*
  previsouly was,
    if (r[`PM`] === true) {
        r.push(Role.PropertyManager)
      }
  */
  if (Array.isArray(resp)) {
    resp.forEach(r => {
      if (r[Role.Admin] === true) {
        r.push(Role.Admin)
      }
      if (r[Role.Buyer] === true) {
        r.push(Role.Buyer)
      }
      if (r[Role.Visitor] === true) {
        r.push(Role.Visitor)
      }
      if (r[Role.Seller] === true) {
        r.push(Role.Seller)
      }
      if (r[Role.PropertyManager] === true) {
        r.push(Role.PropertyManager)
      }
    })
  } else {
    if (resp[Role.Admin] === true) {
      r.push(Role.Admin)
    }
    if (resp[Role.Buyer] === true) {
      r.push(Role.Buyer)
    }
    if (resp[Role.Visitor] === true) {
      r.push(Role.Visitor)
    }
    if (resp[Role.Seller] === true) {
      r.push(Role.Seller)
    }
    if (resp[Role.PropertyManager] === true) {
      r.push(Role.PropertyManager)
    }
  }
  return r
}
