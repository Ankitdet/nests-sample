export interface RealEstateInterface {
  re_id?: string
  user_id?: string
  assetPrice: number
  closingCost: number
  expectedReserveFunds: number
  renovationCosts: number
  propertyTaxes: number
  insurance: number
  utilities: number
  expectedGrossRentPerProperty: number
  totalInvestments: number
  listingPrice: number
  expenses: number
  platformListingFees: number
  platformFees: number
  propertyMgtFees: number
  maintenanceExpense: number
  expectedNetRentPerProperty: number
  expectedGrossRoi: string
  expectedNetRoi: string
  netRentPerToken: number
  totalNumberOfTokens: number
  tokenPrice: number
  // varaible const
  platformListFeesInPercentage: number
  rentProcessingFees: number
  propertyMgmtFees: number
  maintenanceExpenseInPercentage: number
}

export interface RealEstateSmartContract {
  re_id: string
  tokenId: string
  tokenSmartContractUrl: string
  propertyDescription?: string
  additionalPerks?: string
  companyName: string
  closingDate: string
  offeringMemorandumDate: string
}
