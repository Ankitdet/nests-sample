// import { ObjectId } from 'mongoose'

import { IDynamoBase } from '../dynamodb/dynamo-base.interface'

export interface INoPropertFound {
  message?: string
}

/* export interface PropertyInfoInterface {
  data?: RootObject
  error?: NoPropertFoundInterface
} */

// Namespace is created for demo purpose only.
export interface Deed {
  document_type?: string
  recording_date?: string
  original_contract_date?: string
  deed_book?: string
  deed_page?: string
  document_id?: string
  sale_price?: number
  sale_price_description?: string
  transfer_tax?: number
  distressed_sale?: boolean
  real_estate_owned?: string
  seller_first_name?: string
  seller_last_name?: string
  seller2_first_name?: string
  seller2_last_name?: string
  seller_address?: string
  seller_unit_number?: string
  seller_city?: string
  seller_state?: string
  seller_zip_code?: string
  seller_zip_plus_four_code?: string
  buyer_first_name?: string
  buyer_last_name?: string
  buyer2_first_name?: string
  buyer2_last_name?: string
  buyer_address?: string
  buyer_unit_type?: string
  buyer_unit_number?: string
  buyer_city?: string
  buyer_state?: string
  buyer_zip_code?: string
  buyer_zip_plus_four_code?: string
  lender_name?: string
  lender_type?: string
  loan_amount?: number
  loan_type?: string
  loan_due_date?: string
  loan_finance_type?: string
  loan_interest_rate?: number
}

export interface Owner {
  name?: string
  second_name?: string
  unit_type?: string
  unit_number?: string
  formatted_street_address?: string
  city?: string
  state?: string
  zip_code?: string
  zip_plus_four_code?: string
  owner_occupied?: string
}

export interface MarketAssessment {
  year?: number
  land_value?: number
  improvement_value?: number
  total_value?: number
}

export interface Assessment {
  year?: number
  land_value?: number
  improvement_value?: number
  total_value?: number
}

export interface Tax {
  year?: number
  amount?: number
  exemptions?: string[]
  rate_code_area?: string
}

export interface Valuation {
  value?: number
  high?: number
  low?: number
  forecast_standard_deviation?: number
  date?: string
}

export interface OtherArea {
  type?: string
  sq_ft?: string
}

export interface Structure {
  year_built?: number
  effective_year_built?: number
  stories?: string
  rooms_count?: number
  beds_count?: number
  baths?: number
  partial_baths_count?: number
  units_count?: number
  parking_type?: string
  parking_spaces_count?: number
  pool_type?: string
  architecture_type?: string
  construction_type?: string
  exterior_wall_type?: string
  foundation_type?: string
  roof_material_type?: string
  roof_style_type?: string
  heating_type?: string
  heating_fuel_type?: string
  air_conditioning_type?: string
  fireplaces?: string
  basement_type?: string
  quality?: string
  condition?: string
  flooring_types?: string[]
  plumbing_fixtures_count?: number
  interior_wall_type?: string
  water_type?: string
  sewer_type?: string
  total_area_sq_ft?: number
  other_areas?: OtherArea[]
  other_rooms?: string[]
  other_features?: OtherArea[]
  other_improvements?: OtherArea[]
  amenities?: string[]
}

export interface Geojson {
  type?: string
  coordinates?: number[][][][]
}

export interface Boundary {
  wkt?: string
  geojson?: [Geojson]
}

export interface Parcel {
  apn_original?: string
  apn_unformatted?: string
  apn_previous?: string
  fips_code?: string
  frontage_ft?: number
  depth_ft?: number
  area_sq_ft?: number
  area_acres?: number
  county_name?: string
  county_land_use_code?: string
  county_land_use_description?: string
  standardized_land_use_category?: string
  standardized_land_use_type?: string
  location_descriptions?: string[]
  zoning?: string
  building_count?: number
  tax_account_number?: string
  legal_description?: string
  lot_code?: string
  lot_number?: string
  subdivision?: string
  municipality?: string
  section_township_range?: string
}

export interface Address {
  street_number?: string
  street_pre_direction?: string
  street_name?: string
  street_suffix?: string
  street_post_direction?: string
  unit_type?: string
  unit_number?: string
  formatted_street_address?: string
  city?: string
  state?: string
  zip_code?: string
  zip_plus_four_code?: string
  carrier_code?: string
  latitude?: number
  longitude?: number
  geocoding_accuracy?: string
  census_tract?: string
}

export interface Metadata {
  publishing_date?: string
}

export interface IRealEstateListing extends IDynamoBase {
  re_id?: string
  user_id?: string
  deeds?: Deed[]
  owner?: Owner
  market_assessments?: MarketAssessment[]
  assessments?: Assessment[]
  taxes?: Tax[]
  valuation?: Valuation
  structure?: Structure
  boundary?: Boundary
  parcel?: Parcel
  address?: Address
  metadata?: Metadata
  createdAt?: string
  updatedAt?: string
  youtubeLink?: string
  metaLink?: string
  metaLandRevenueStream?: string
}
