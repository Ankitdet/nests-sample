import { RealEstateFinanceSchema } from '..'
import {
  Assessment,
  Deed,
  MarketAssessment,
  Metadata,
  OtherArea,
  Tax,
} from '../../interfaces'
import { CommonSchema } from '../common.schema'

export interface RealEstateSchema extends RealEstateFinanceSchema, CommonSchema {
  re_id?: string
  userId?: string
  add?: string
  city?: string
  state?: string
  zip?: string
  metadata?: Metadata
  // address?: Address
  address_street_number?: string
  address_street_pre_direction?: any
  address_street_name?: string
  address_street_suffix?: string
  address_street_post_direction?: any
  address_unit_type?: any
  address_unit_number?: any
  address_streetAddress?: string
  address_city?: string
  address_state?: string
  address_zipCode?: string
  address_zip_plus_four_code?: string
  address_carrier_code?: string
  address_latitude?: number
  address_longitude?: number
  address_geocoding_accuracy?: string
  address_census_tract?: string

  // parcel?: Parcel
  parcel_apn_original?: string
  parcel_apn_unformatted?: string
  parcel_apn_previous?: any
  parcel_fips_code?: string
  parcel_frontage_ft?: number
  parcel_depth_ft?: number
  parcel_area_sq_ft?: number
  parcel_area_acres?: number
  parcel_county_name?: string
  parcel_county_land_use_code?: string
  parcel_county_land_use_description?: string
  parcel_standardized_land_use_category?: string
  parcel_standardized_land_use_type?: string
  parcel_location_descriptions?: any[]
  parcel_zoning?: string
  parcel_building_count?: any
  parcel_tax_account_number?: string
  parcel_legal_description?: string
  parcel_lot_code?: any
  parcel_lot_number?: string
  parcel_subdivision?: string
  parcel_municipality?: string
  parcel_section_township_range?: string

  // boundary?: Boundary
  boundary_wkt?: string
  boundary_geojson?: any

  /* structure?: Structure */
  structure_year_built?: number
  structure_effective_year_built?: number
  structure_stories?: string
  structure_rooms_count?: number
  structure_beds_count?: number
  structure_baths?: number
  structure_partial_baths_count?: any
  structure_units_count?: number
  structure_parking_type?: string
  structure_parking_spaces_count?: number
  structure_pool_type?: any
  structure_architecture_type?: string
  structure_construction_type?: string
  structure_exterior_wall_type?: string
  structure_foundation_type?: any
  structure_roof_material_type?: string
  structure_roof_style_type?: string
  structure_heating_type?: string
  structure_heating_fuel_type?: any
  structure_air_conditioning_type?: string
  structure_fireplaces?: any
  structure_basement_type?: any
  structure_quality?: string
  structure_condition?: string
  structure_flooring_types?: string[]
  structure_plumbing_fixtures_count?: any
  structure_interior_wall_type?: string
  structure_water_type?: any
  structure_sewer_type?: any
  structure_total_area_sq_ft?: number
  structure_other_areas?: OtherArea[]
  structure_other_rooms?: any[]
  structure_other_features?: OtherArea[]
  structure_other_improvements?: any[]
  structure_amenities?: any[]

  // valuation?: Valueation
  valuation_value?: number
  valuation_high?: number
  valuation_low?: number
  valuation_forecast_standard_deviation?: number
  valuation_date?: string

  taxes?: Tax[]

  assessments?: Assessment[]

  market_assessments?: MarketAssessment[]

  // owner?: Owner
  owner_name?: string
  owner_second_name?: string
  owner_unit_type?: string
  owner_unit_number?: string
  owner_formatted_street_address?: string
  owner_city?: string
  owner_state?: string
  owner_zip_code?: string
  owner_zip_plus_four_code?: string
  owner_occupied?: string

  deeds?: Deed[]

  token_id?: string
  token_smart_contract_url?: string
  property_description?: string
  additional_perks?: string

  youtube_link?: string
  meta_link?: string
  meta_land_revenue_stream?: string
  company_name?: string
  closing_date?: string
  offering_memorandum_date?: string
}
