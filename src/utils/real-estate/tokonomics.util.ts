import * as env from '@const/environments'
import { RealEstateArgs } from '@core/args'
import { RealEstateInterface } from '@core/interfaces'

export const tokonomicsEnginee = async (
  realEstateInput: RealEstateArgs,
): Promise<RealEstateInterface> => {
  const totalInvestments =
    realEstateInput.assetPrice +
    realEstateInput.closingCost +
    realEstateInput.expectedReserveFunds +
    realEstateInput.renovationCosts

  // line 13
  const platform_listing_fees = realEstateInput.platformListFeesInPercentage

  // line 14
  // This is estimated fees toward rent processing, usually 2% of gross rent collected.
  const platform_fees =
    (realEstateInput.rentProcessingFees / 100) *
    realEstateInput.expectedGrossRentPerProperty

  // line 15
  const propertyMgmtfees =
    (realEstateInput.propertyMgmtFees / 100) *
    realEstateInput.expectedGrossRentPerProperty

  // line 16
  const maintExpense =
    (realEstateInput.maintenanceExpenseInPercentage / 100) *
    realEstateInput.expectedGrossRentPerProperty

  // line 8
  const listingPrice = totalInvestments + platform_listing_fees

  // line 9
  const expenses =
    realEstateInput.propertyTaxes +
    realEstateInput.insurance +
    realEstateInput.utilities +
    platform_fees +
    propertyMgmtfees +
    maintExpense

  const expectedNetRentPerProperty =
    realEstateInput.expectedGrossRentPerProperty - expenses

  const expectedGrossRoiPerProperty =
    (realEstateInput.expectedGrossRentPerProperty / listingPrice) * 100

  const expectedNetRoiPerProperty = (expectedNetRentPerProperty / listingPrice) * 100

  const totalNumberOfTokens =
    Math.ceil(listingPrice / env.BASE_ON_CALCULATE_TOKEN) * env.TOKEN_PER_BASE
  const tokenPrice = Number((listingPrice / totalNumberOfTokens).toFixed(5))
  const netRentPerToken = Number(
    (expectedNetRentPerProperty / totalNumberOfTokens).toFixed(2),
  )
  return {
    platformListFeesInPercentage: realEstateInput.platformListFeesInPercentage,

    propertyMgmtFees: realEstateInput.propertyMgmtFees,

    rentProcessingFees: realEstateInput.rentProcessingFees,

    maintenanceExpenseInPercentage: realEstateInput.maintenanceExpenseInPercentage,

    propertyMgtFees: propertyMgmtfees,

    assetPrice: realEstateInput.assetPrice,

    closingCost: realEstateInput.closingCost,

    expectedReserveFunds: realEstateInput.expectedReserveFunds,

    renovationCosts: realEstateInput.renovationCosts,

    propertyTaxes: realEstateInput.propertyTaxes,

    insurance: realEstateInput.insurance,

    utilities: realEstateInput.utilities,

    expectedGrossRentPerProperty: realEstateInput.expectedGrossRentPerProperty,

    totalInvestments,

    listingPrice,

    expenses,

    platformListingFees: platform_listing_fees,

    platformFees: platform_fees,

    maintenanceExpense: maintExpense,

    expectedNetRentPerProperty: Number(expectedNetRentPerProperty.toFixed(0)),

    expectedGrossRoi: expectedGrossRoiPerProperty.toFixed(5),

    expectedNetRoi: expectedNetRoiPerProperty.toFixed(5),

    netRentPerToken,

    totalNumberOfTokens,

    tokenPrice,
  }
}
