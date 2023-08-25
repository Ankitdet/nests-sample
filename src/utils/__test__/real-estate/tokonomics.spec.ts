import { RealEstateArgs } from '@core/args'
import { RealEstateInterface } from '../../../core/interfaces'
import { tokonomicsEnginee } from '../../real-estate/tokonomics.util'

let inputs: RealEstateArgs = {
  re_id: '3a07dd31-32e1-4926-8d6f-b0ec9d4a626d',
  assetPrice: 100000,
  closingCost: 5000,
  expectedGrossRentPerProperty: 20000,
  expectedReserveFunds: 10000,
  insurance: 600,
  maintenanceExpenseInPercentage: 6,
  rentProcessingFees: 2,
  platformListFeesInPercentage: 8,
  propertyMgmtFees: 8,
  propertyTaxes: 1880,
  renovationCosts: 5055,
  utilities: 2400,
}

const outputs: RealEstateInterface = {
  assetPrice: 100000,
  closingCost: 5000,
  expectedReserveFunds: 10000,
  renovationCosts: 5055,
  propertyTaxes: 1880,
  insurance: 600,
  utilities: 2400,
  expectedGrossRentPerProperty: 20000,
  totalInvestments: 120055,
  listingPrice: 129659.4,
  expenses: 17684.4,
  platformListingFees: 9604.4,
  platformFees: 400,
  propertyMgtFees: 1600,
  maintenanceExpense: 1200,
  expectedNetRentPerProperty: 11920,
  expectedNetRoi: '9.19332',
  expectedGrossRoi: '15.42503',
  totalNumberOfTokens: 2600,
  netRentPerToken: 4.58,
  maintenanceExpenseInPercentage: 6,
  rentProcessingFees: 2,
  platformListFeesInPercentage: 8,
  propertyMgmtFees: 8,
  tokenPrice: 49.869,
}

describe('tokonomics engineee', () => {
  it('should be positive flow', async () => {
    const returnData = await tokonomicsEnginee(inputs)
    expect(returnData).toStrictEqual(outputs)
  })

  it('should not be allowed negative values', async () => {
    inputs = {
      re_id: 'cd7bb82f-7efe-4f0b-839d-124141535f6e',
      assetPrice: -1200,
      closingCost: 5000,
      expectedGrossRentPerProperty: 20000,
      expectedReserveFunds: 10000,
      insurance: 600,
      maintenanceExpenseInPercentage: 6,
      rentProcessingFees: 2,
      platformListFeesInPercentage: 8,
      propertyMgmtFees: 8,
      propertyTaxes: 1880,
      renovationCosts: 5055,
      utilities: 2400,
    }
    const returnData = await tokonomicsEnginee(inputs)
    expect(returnData).toStrictEqual(outputs)
  })

  it('should not be allowed zero percentage values', async () => {})
})
