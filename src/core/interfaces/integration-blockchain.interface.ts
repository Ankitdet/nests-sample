import { bool } from 'aws-sdk/clients/signer'

export interface IBlockchainDetails {
  result: string | null
}

export interface IAddressDetails {
  result: bool | false
}
