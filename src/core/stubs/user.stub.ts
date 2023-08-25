import { UserType } from '../object-types'

export const sellerStub = (): UserType => {
  return {
    _id: '2',
    address: {
      city: 'cty',
      state: 'state',
      country: 'c',
      street: 's',
      zip: 'zip',
    },
    firstname: 'ankit',
    lastname: 'detroja',
  }
}

export const sellerTypeStub = (): UserType => {
  return {
    _id: '123',
    address: {
      city: 'cty',
      state: 'state',
      country: 'c',
      street: 's',
      zip: 'zip',
    },
    firstname: 'ankit',
    lastname: 'detroja',
  }
}
