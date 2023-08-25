import { STAGE } from '@const/environments'
import { Environments } from '@core/enums'

export const getContract = () => {
  let contactJson = null
  if (STAGE === Environments.DEV) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    contactJson = require('@resources/blockchain/Tkn3blksNft.dev.json')
  } else if (STAGE === Environments.STAGE) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    contactJson = require('@resources/blockchain/Tkn3blksNft.stg.json')
  } else if (STAGE === Environments.PROD) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    contactJson = require('@resources/blockchain/Tkn3blksNft.prd.json')
  }
  return contactJson
}
