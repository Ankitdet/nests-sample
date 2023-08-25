export const getsdkTokenMutation = `mutation {
  generateSdkToken(inputs: { applicantId: "string" })
}`

export const getReDataFromId = `query {
  getRealEstateFinanceByReId(input: { re_id: "7deca695-18bd-4adf-b321-77bbf26435df" }) {
    assetPrice
    closingCost
    expectedGrossRentPerProperty
    expectedGrossRoi
    expectedNetRentPerProperty
    expectedNetRoiPerProperty
    expectedReserveFunds
    expenses
    insurance
    listingPrice
    maintenanceExpense
    netRentPerToken
    numberOfTokens
    platformFees
    platformListingFees
    propertyMgtFees
    propertyTaxes
    re_id
    renovationCosts
    tokenPrice
    totalInvestments
    user_id
    utilities
  }
}
`