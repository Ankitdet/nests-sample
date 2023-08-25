import { RealEstateSchema } from '..'
import { CommonSchema } from '../common.schema'

export interface RealEstateFinanceSchema {
  re_id?: string
  assetPrice?: number
  closingCost?: number
  expectedReserveFunds?: number
  renovationCosts?: number
  propertyTaxes?: number
  insurance?: number
  utilities?: number
  expectedGrossRentPerProperty?: number
  totalInvestments?: number
  listingPrice?: number
  expenses?: number
  platformListingFees?: number
  platformFees?: number
  propertyMgtFees?: number
  maintenanceExpense?: number
  expectedNetRentPerProperty?: number
  expectedGrossRoi?: string
  expectedNetRoi?: string
  netRentPerToken?: number
  totalNumberOfTokens?: number
  tokenPrice?: number
  // TODO ?: platform_listing_fees
  platformListFeesInPercentage?: number

  rentProcessingFees?: number

  propertyMgmtFees?: number
  maintenanceExpenseInPercentage?: number

  tokensRemaining?: number
  tokensOnHold?: number
  tokensSold?: number
  totalTokensOwnedByBuyer?: number

  tokenId?: string
  tokenSmartContractUrl?: string
}

export interface RealEstateAndFinance extends RealEstateSchema, CommonSchema {
  re_id?: string
  asset_price?: number
  closing_cost?: number
  expected_reserve_funds?: number
  renovation_costs?: number
  property_taxes?: number
  insurance?: number
  utilities?: number
  expected_gross_rent_per_property?: number
  total_investments?: number
  listing_price?: number
  expenses?: number
  platform_listing_fees?: number
  platform_fees?: number
  property_mgt_fees?: number
  maintenance_expense?: number
  expected_net_rent_per_property?: number
  expected_gross_roi?: string
  expected_net_roi?: string
  net_rent_per_token?: string
  total_number_of_tokens?: number
  token_price?: string
  // TODO ?: platform_listing_fees
  platform_list_fees_in_percentage?: number

  rent_processing_fees?: number

  property_mgmt_fees?: number
  maintenance_expense_in_percentage?: number

  tokens_remaining?: number
  tokens_on_hold?: number
  tokens_sold?: number
  total_tokens_owned_by_buyer?: number

  token_id?: string
  token_smart_contract_url?: string
}
