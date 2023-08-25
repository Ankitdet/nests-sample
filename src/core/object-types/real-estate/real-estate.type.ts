import { TypeName } from '@core/enums'
import {
  Field,
  Float,
  Int,
  IntersectionType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql'
import {
  AbstractTrue,
  NullableFalse,
  NullableTrue,
  UUID_VERSION,
} from '@utils/common.utils'
import { IsUUID } from 'class-validator'
import { CommonType } from '../common.type'

/** RealEstate Type */
@ObjectType(TypeName.RealEstateFinanceType)
export class PropertyFinancial extends CommonType {
  @Field({ ...NullableTrue })
  @IsUUID(UUID_VERSION)
  re_id?: string
  @Field({ ...NullableTrue, description: 'Real estate id' })
  @IsUUID(UUID_VERSION)
  user_id?: string
  @Field(() => Float, { ...NullableTrue, description: 'Asset price of the property.' })
  assetPrice: number
  @Field(() => Float, { ...NullableTrue, description: 'Closing cost of property' })
  closingCost: number
  @Field(() => Float, { ...NullableTrue, description: 'Expected reserve funds' })
  expectedReserveFunds: number
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Renovation cost for the property',
  })
  renovationCosts: number
  // Expenses
  @Field(() => Float, { ...NullableTrue, description: 'Property Taxes.' })
  propertyTaxes: number
  @Field(() => Float, { ...NullableTrue, description: 'Property Insurance' })
  insurance: number
  @Field(() => Float, { ...NullableTrue, description: 'Utilities' })
  utilities: number
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Expected Gross Rent per property.',
  })
  expectedGrossRentPerProperty: number
  @Field(() => Float, { ...NullableTrue, description: 'Total Investments.' })
  totalInvestments: string
  @Field(() => Float, { ...NullableTrue, description: 'Listing price of the property' })
  listingPrice: string
  @Field(() => Float, { ...NullableTrue, description: 'Expenses' })
  expenses: string
  @Field(() => Float, { ...NullableTrue, description: 'Platform Listing fees ' })
  platformListingFees: string
  @Field(() => Float, { ...NullableTrue, description: 'Platform fees' })
  platformFees: string
  @Field(() => Float, { ...NullableTrue, description: 'Property Mgt Fees.' })
  propertyMgtFees: string
  @Field(() => Float, { ...NullableTrue, description: 'Maintenance Expense' })
  maintenanceExpense: string
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Expected net rent per property',
  })
  expectedNetRentPerProperty: string
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Expected gross Roi per property',
  })
  expectedGrossRoi: string
  @Field(() => Float, { ...NullableTrue, description: 'Expected Net Roi per property' })
  expectedNetRoi: string
  @Field(() => Float, { ...NullableTrue, description: 'Net rent per Token' })
  netRentPerToken: number
  @Field(() => Float, { ...NullableTrue, description: 'Number of tokens.' })
  totalNumberOfTokens: number
  @Field(() => Float, { ...NullableTrue, description: 'Token price' })
  tokenPrice: number
  @Field(() => Float, { ...NullableTrue, description: 'tokens remaining' })
  tokensRemaining: number
}

@ObjectType(TypeName.AddressType, { ...AbstractTrue })
class AddressType {
  @Field({ ...NullableTrue, description: 'Street number of the property.' })
  street_number?: string
  @Field({
    ...NullableTrue,
    description: 'pre direction of the street of the property',
  })
  street_pre_direction?: string
  @Field({ ...NullableTrue, description: 'Street Name of the property' })
  street_name?: string
  @Field({ ...NullableTrue, description: 'Street suffix of property' })
  street_suffix?: string
  @Field({ ...NullableTrue, description: 'Street post direction of the property' })
  street_post_direction?: string
  @Field({ ...NullableTrue, description: 'Unit type of property' })
  unit_type?: string
  @Field({ ...NullableTrue, description: 'Unit number of property' })
  unit_number?: string
  @Field({ ...NullableTrue, description: 'formatted street address of the property' })
  formatted_street_address?: string
  @Field({ ...NullableTrue, description: 'city of the property' })
  city?: string
  @Field({ ...NullableTrue, description: 'state of property' })
  state?: string
  @Field({
    ...NullableTrue,
    description: 'Zipcode(for USA) of the location of the property ',
  })
  zip_code?: string
  @Field({ ...NullableTrue, description: 'zip plus four code of the property' })
  zip_plus_four_code?: string
  @Field({ ...NullableTrue, description: 'Carrier code of the property' })
  carrier_code?: string
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Latitude of the geographical location of the property',
  })
  latitude?: number
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Longitude of the geographical location of the property',
  })
  longitude?: number
  @Field({ ...NullableTrue, description: 'geocoding accuracy of property' })
  geocoding_accuracy?: string
  @Field({ ...NullableTrue, description: 'census track of the property' })
  census_tract?: string
}

@ObjectType(TypeName.DeedType, { ...AbstractTrue })
class DeedType {
  @Field({ ...NullableTrue, description: 'Type of deed document.' })
  document_type: string
  @Field({
    ...NullableTrue,
    description: 'The official date the document was recorded.',
  })
  recording_date: string
  @Field({
    ...NullableTrue,
    description:
      'The date the original contract was signed by the relevant parties. In some scenarios this may be the date of notarization.',
  })
  original_contract_date: string
  @Field({
    ...NullableTrue,
    description: 'The physical book where the deed was recorded.',
  })
  deed_book: string
  @Field({
    ...NullableTrue,
    description: 'The physical page where the deed was recorded.',
  })
  deed_page: string
  @Field({
    ...NullableTrue,
    description: 'Identifier assigned to document at the recording date.',
  })
  document_id: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The total sale price in dollars.',
  })
  sale_price: number
  @Field({ ...NullableTrue, description: 'A description of the sale.' })
  sale_price_description: string
  @Field({
    ...NullableTrue,
    description: 'The tax amount levied by the city, county, or a combination thereof.',
  })
  transfer_tax: number
  @Field({
    ...NullableTrue,
    description: 'An indicator to determine if the sale was deemed to be distressed.',
  })
  distressed_sale: boolean
  @Field({
    ...NullableTrue,
    description: 'An indicator used to determine the status of the transfer.',
  })
  real_estate_owned: string
  @Field({
    ...NullableTrue,
    description: 'Seller first name, or null if corporate owner.',
  })
  seller_first_name: string
  @Field({ ...NullableTrue, description: 'Seller last name, or corporate name.' })
  seller_last_name: string
  @Field({
    ...NullableTrue,
    description: 'The second seller first name, or null if corporate owner.',
  })
  seller2_first_name: string
  @Field({
    ...NullableTrue,
    description: 'The second seller last name, or corporate name.',
  })
  seller2_last_name: string
  @Field({ ...NullableTrue, description: 'The seller mailing address.' })
  seller_address: string
  @Field({ ...NullableTrue, description: 'The seller unit number.' })
  seller_unit_number: string
  @Field({ ...NullableTrue, description: 'The seller city.' })
  seller_city: string
  @Field({ ...NullableTrue, description: 'The seller mailing state.' })
  seller_state: string
  @Field({ ...NullableTrue, description: 'Seller zip code.' })
  seller_zip_code: string
  @Field({ ...NullableTrue, description: 'Seller four digit postal zip extension.' })
  seller_zip_plus_four_code: string
  @Field({
    ...NullableTrue,
    description: 'Buyer first name, or null if corporate owner.',
  })
  buyer_first_name: string
  @Field({ ...NullableTrue, description: 'Buyer last name, or corporate name.' })
  buyer_last_name: string
  @Field({
    ...NullableTrue,
    description: 'Second buyer first name, or null if corporate owner.',
  })
  buyer2_first_name: string
  @Field({ ...NullableTrue, description: 'Second buyer last name, or corporate name.' })
  buyer2_last_name: string
  @Field({ ...NullableTrue, description: 'Buyer mailing address.' })
  buyer_address: string
  @Field({ ...NullableTrue, description: 'Buyer unit type.' })
  buyer_unit_type: string
  @Field({ ...NullableTrue, description: 'Buyer unit number.' })
  buyer_unit_number: string
  @Field({ ...NullableTrue, description: 'Buyer mailing city.' })
  buyer_city: string
  @Field({ ...NullableTrue, description: 'Buyer mailing state.' })
  buyer_state: string
  @Field({ ...NullableTrue, description: 'Buyer mailing zip code.' })
  buyer_zip_code: string
  @Field({ ...NullableTrue, description: 'Buyer four digit postal zip extension.' })
  buyer_zip_plus_four_code: string
  @Field({ ...NullableTrue, description: 'Mortgage lender.' })
  lender_name: string
  @Field({ ...NullableTrue, description: 'The type of lender.' })
  lender_type: string
  @Field(() => Int, { ...NullableTrue, description: 'Mortgage recorded in dollars.' })
  loan_amount?: number
  @Field({ ...NullableTrue, description: 'Type of loan security.' })
  loan_type: string
  @Field({
    ...NullableTrue,
    description: 'The date the mortgage will be paid in full.',
  })
  loan_due_date: string
  @Field({ ...NullableTrue, description: 'The interest rate type on the loan.' })
  loan_finance_type?: string
  @Field(() => Float, {
    ...NullableTrue,
    description: 'The interest rate of the loan.',
  })
  loan_interest_rate?: number
}

@ObjectType(TypeName.OwnerType, { ...AbstractTrue })
class OwnerType {
  @Field({ ...NullableTrue, description: 'Assessed owner names.' })
  name?: string
  @Field({
    ...NullableTrue,
    description:
      'As of March 1, 2020, this field has been deprecated and will return null. Any additional owner names have been merged with the primary owner name.',
  })
  second_name?: string
  @Field({ ...NullableTrue, description: 'The unit type.' })
  unit_type?: string
  @Field({ ...NullableTrue, description: 'The unit number.' })
  unit_number?: string
  @Field({
    ...NullableTrue,
    description:
      'The address where the current tax bill is mailed (not including unit).',
  })
  formatted_street_address?: string
  @Field({
    ...NullableTrue,
    description:
      'The city where the current tax bill is mailed. In the case it is out of USA, the county will also be located here.',
  })
  city?: string
  @Field({
    ...NullableTrue,
    description:
      'The state abbreviation where the current tax bill is mailed; XX for out of country addresses.',
  })
  state?: string
  @Field({
    ...NullableTrue,
    description: 'The zip code where the current tax bill is mailed.',
  })
  zip_code?: string
  @Field({
    ...NullableTrue,
    description: 'Four digit postal zip extension for where the tax bill is mailed.',
  })
  zip_plus_four_code?: string
  @Field({
    ...NullableTrue,
    description:
      'Description of the owner occupancy. Can be "YES" or "PROBABLE". Data not available if null.',
  })
  owner_occupied: string
}

@ObjectType(TypeName.MarketAssessmentType, { ...AbstractTrue })
class MarketAssessmentType {
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The year the market assessment was performed.',
  })
  year: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The market land value as determined by the assessor.',
  })
  land_value: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The market improvement value as determined by the assessor.',
  })
  improvement_value: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The total market value as determined by the assessor.',
  })
  total_value: number
}

@ObjectType(TypeName.AssessmentType, { ...AbstractTrue })
class AssessmentType {
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The year the assessment was performed.',
  })
  year: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The current assessed land value before any exemptions in dollars.',
  })
  land_value?: number
  @Field(() => Int, {
    ...NullableTrue,
    description:
      'The current assessed improvement value before any exemptions in dollars.',
  })
  improvement_value?: number
  @Field(() => Int, {
    ...NullableTrue,
    description:
      'The total current assessed value of both land and improvements before any exemptions in dollars.',
  })
  total_value: number
}

@ObjectType(TypeName.TaxType, { ...AbstractTrue })
class TaxType {
  @Field(() => Int, { ...NullableTrue, description: 'The year the tax was levied.' })
  year: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The amount of tax on the property in dollars.',
  })
  amount: number
  @Field(() => [String], { ...NullableTrue, description: 'List of exemptions.' })
  exemptions: [string]
  @Field({
    ...NullableTrue,
    description:
      'Represents separate tax jurisdictions within the county as provided on the county tax/assessment roll.',
  })
  rate_code_area: string
}

@ObjectType(TypeName.ValuationType, { ...AbstractTrue })
class ValuationType {
  @Field(() => Int, { ...NullableTrue, description: 'The current property value.' })
  value: number
  @Field(() => Int, { ...NullableTrue, description: 'The highest probable value.' })
  high: number
  @Field(() => Int, { ...NullableTrue, description: 'The lowest probable value.' })
  low: number
  @Field(() => Int, { ...NullableTrue, description: 'Forecast standard deviation.' })
  forecast_standard_deviation: number
  @Field({ ...NullableTrue, description: 'The date the valuation was performed.' })
  date: string
}

@ObjectType(TypeName.OtherAreaType, { ...AbstractTrue })
class OtherAreaType {
  @Field({ ...NullableTrue, description: 'type' })
  type: string
  @Field({ ...NullableTrue, description: 'square feet' })
  sq_ft: string
}

@ObjectType(TypeName.OtherFeaturesType, { ...AbstractTrue })
class OtherFeaturesType {
  @Field({ ...NullableTrue })
  type: string
  @Field({ ...NullableTrue })
  sq_ft: string
}
@ObjectType(TypeName.OtherImprovementsType, { ...AbstractTrue })
class OtherImprovementsType {
  @Field({ ...NullableTrue, description: 'type' })
  type: string
  @Field({ ...NullableTrue, description: 'square feet' })
  sq_ft: string
}

@ObjectType(TypeName.StructureType, { ...AbstractTrue })
class StructureType {
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The year the structure was built.',
  })
  year_built: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The year a structure was substantially updated or improved.',
  })
  effective_year_built: number
  @Field({
    ...NullableTrue,
    description:
      'The number of stories comprising the structure (may include fractional stories and alphabetic codes).',
  })
  stories: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The total number of rooms in the building (not just bedrooms).',
  })
  rooms_count?: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The number of bedrooms in the building.',
  })
  beds_count: number
  @Field(() => Float, {
    ...NullableTrue,
    description:
      'Fractional number of bathrooms in the building, except when partial_baths_count is nonnull, see below.',
  })
  baths: number
  @Field(() => Int, {
    ...NullableTrue,
    description:
      'The whole number of partial bathrooms. When this is nonnull, baths above will be a whole number indicating the number of full bathrooms.',
  })
  partial_baths_count?: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Total number of units reported to the county.',
  })
  units_count: number
  @Field({ ...NullableTrue, description: 'The type of parking available.' })
  parking_type: string
  @Field(() => Int, {
    ...NullableTrue,
    description:
      'The total number of available parking spaces; including garage, carport, driveway.',
  })
  parking_spaces_count: number
  @Field({
    ...NullableTrue,
    description: 'Type of pool located on the property - shared or private.',
  })
  pool_type?: string
  @Field({
    ...NullableTrue,
    description: 'Style or historical period of the primary structure.',
  })
  architecture_type: string
  @Field({
    ...NullableTrue,
    description: 'Type of material used in construction of the building.',
  })
  construction_type: string
  @Field({
    ...NullableTrue,
    description: 'Material used for the exterior walls of the building.',
  })
  exterior_wall_type: string
  @Field({
    ...NullableTrue,
    description: 'The type of material used in the foundation.',
  })
  foundation_type?: string
  @Field({
    ...NullableTrue,
    description: 'The material used for the roof of the building.',
  })
  roof_material_type: string
  @Field({
    ...NullableTrue,
    description: 'The architectural style for the roof of the building.',
  })
  roof_style_type: string
  @Field({ ...NullableTrue, description: 'Primary heating type for the building.' })
  heating_type: string
  @Field({ ...NullableTrue, description: 'Type of fuel used to heat the building.' })
  heating_fuel_type?: string
  @Field({ ...NullableTrue, description: 'Air conditioning type for the building.' })
  air_conditioning_type: string
  @Field({
    ...NullableTrue,
    description: 'Total number of fireplaces in the building (can also be "YES")',
  })
  fireplaces?: string
  @Field({ ...NullableTrue, description: 'Basement type for the building.' })
  basement_type?: string
  @Field({
    ...NullableTrue,
    description:
      'The quality of the structure rated from A+ to E+. This grade is determined by the county and is based on numerous, non-standard factors. For example, a mobile home would likely have a lower score than a mansion as the mobile home uses cheaper, lower quality materials and has less features.',
  })
  quality: string
  @Field({
    ...NullableTrue,
    description:
      'Current condition of the structure provided by the county. This relates to things like whether or not there is visible wear on the structure (e.g. chipped paint, siding falling off). The method for determining this varies across counties.',
  })
  condition: string
  @Field(() => [String], {
    ...NullableTrue,
    description: 'Type of flooring used in improvements in the building.',
  })
  flooring_types: [string]
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Total number of all plumbing fixtures in the building.',
  })
  plumbing_fixtures_count?: number
  @Field({
    ...NullableTrue,
    description: 'The type of material used for the interior walls.',
  })
  interior_wall_type: string
  @Field({ ...NullableTrue, description: 'The water system for the property.' })
  water_type?: string
  @Field({
    ...NullableTrue,
    description: 'The waste disposal/sewage system for the property.',
  })
  sewer_type?: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Total livable square footage of the structure.',
  })
  total_area_sq_ft: number
  @Field(() => [OtherAreaType], {
    ...NullableTrue,
    description:
      'List of objects describing areas within the building, and their corresponding size in sq ft. Size is a string holding an integer.',
  })
  other_areas: [OtherAreaType]
  @Field(() => [String], {
    ...NullableTrue,
    description: 'List of other rooms within the building.',
  })
  other_rooms: [string]
  @Field(() => [OtherFeaturesType], {
    ...NullableTrue,
    description:
      'List of objects describing features in or around the building, and their corresponding size in sq ft. Size is a string holding an integer, float, or rectangle (e.g. "24X16").',
  })
  other_features: [OtherFeaturesType]
  @Field(() => [OtherImprovementsType], {
    ...NullableTrue,
    description:
      'List of objects describing improvements to the property or building, and their corresponding size in sq ft. Size is a string holding an integer, float, or rectangle (e.g. "24X16").',
  })
  other_improvements: [OtherImprovementsType]
  @Field(() => [String], {
    ...NullableTrue,
    description: 'List of amenities included in the property.',
  })
  amenities: [string]
}

@ObjectType(TypeName.GeojsonType, { ...AbstractTrue })
class GeojsonType {
  @Field({ ...NullableTrue, description: 'type' })
  type: string
  @Field(() => [[[Float]]], {
    ...NullableTrue,
    complexity: 5,
    description: 'coordinates',
  })
  coordinates: number[][][]
}

@ObjectType(TypeName.BoundaryType, { ...AbstractTrue })
class BoundaryType {
  @Field({
    ...NullableTrue,
    description:
      'The Well-Known Text representation of the boundary as a multipolygon. For use with GIS software.',
  })
  wkt: string
  @Field(() => GeojsonType, {
    ...NullableTrue,
    description: 'For a parsed representation of the boundary.',
  })
  geojson: GeojsonType
}

@ObjectType(TypeName.ParcelType, { ...AbstractTrue })
class ParcelType {
  @Field({ ...NullableTrue, description: 'The formatted assessors parcel number.' })
  apn_original: string
  @Field({ ...NullableTrue, description: 'The unformatted assessors parcel number.' })
  apn_unformatted: string
  @Field({
    ...NullableTrue,
    description: 'A previous assessors parcel number, formatted.',
  })
  apn_previous?: string
  @Field({
    ...NullableTrue,
    description: 'Unique County identifier, first 2 digits are state FIPS.',
  })
  fips_code: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Frontage measurement of the parcel in feet.',
  })
  frontage_ft: number
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Depth measurement of the parcel in feet.',
  })
  depth_ft: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Total area of the parcel in square feet.',
  })
  area_sq_ft: number
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Total area of the parcel in acres.',
  })
  area_acres: number
  @Field({ ...NullableTrue, description: 'The name of the county.' })
  county_name: string
  @Field({
    ...NullableTrue,
    description:
      'The land use code as provided directly from the county, without interpretation.',
  })
  county_land_use_code: string
  @Field({
    ...NullableTrue,
    description:
      'The land use description as provided by directly from the county, without interpretation.',
  })
  county_land_use_description: string
  @Field({
    ...NullableTrue,
    description:
      'The general land use category for the property, converted to a common set of values across all counties.',
  })
  standardized_land_use_category: string
  @Field({
    ...NullableTrue,
    description:
      'Describes further granularity into the land use type, converted to a common set of values across all counties.',
  })
  standardized_land_use_type: string
  @Field(() => [String], {
    ...NullableTrue,
    description: 'List describing the location and surrounding area.',
  })
  location_descriptions: string[]
  @Field({
    ...NullableTrue,
    description: 'City zoning designation, unique to each incorporated area.',
  })
  zoning: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Count of all buildings on the property.',
  })
  building_count?: number
  @Field({
    ...NullableTrue,
    description: 'Parcel identifier used by the tax assessor.',
  })
  tax_account_number: string
  @Field({
    ...NullableTrue,
    description: 'Legal description as provided by the assessor.',
  })
  legal_description: string
  @Field({
    ...NullableTrue,
    description: 'Indicates properties with multiple or partial lots.',
  })
  lot_code?: string
  @Field({
    ...NullableTrue,
    description:
      'Number(s) identifying individual lots making up a property, separated by a comma (,), or ampersand (&). Ranges are denoted by a hyphen (-).',
  })
  lot_number: string
  @Field({
    ...NullableTrue,
    description:
      'The name of the subdivision, plat, or tract in which the property is located',
  })
  subdivision: string
  @Field({
    ...NullableTrue,
    description: 'The jurisdiction in which the property is located.',
  })
  municipality: string
  @Field({
    ...NullableTrue,
    description: 'Section township range meridian identifier.',
  })
  section_township_range: string
}

@ObjectType(TypeName.MetadataType, { ...AbstractTrue })
class MetadataType {
  @Field({
    ...NullableTrue,
    description:
      'The date on which assessor roll data is published or received from the county assessor for the propertys county.',
  })
  publishing_date: string
}

@ObjectType(TypeName.NoPropertyFoundType, { ...AbstractTrue })
export class NoPropertFoundType {
  @Field({
    ...NullableTrue,
    description: ' If there is no property data found an error is occured',
  })
  message?: string
}

@ObjectType(TypeName.RealEstateListingType)
export class RealEstateListingType extends CommonType {
  @Field({ ...NullableTrue, description: 'registration id' })
  re_id?: string

  @Field(() => [DeedType], {
    ...NullableTrue,
    description:
      'Up to 40 years of sale and mortgage data which constitute a deed record.',
  })
  deeds: [DeedType]

  @Field(() => OwnerType, {
    ...NullableTrue,
    description: 'Current owner details taken from the assessment.',
  })
  owner: OwnerType

  @Field(() => [MarketAssessmentType], {
    ...NullableTrue,
    description:
      'Market assessment data as determined by the assessor. These assessments indicate an approximate market value of a property.',
  })
  market_assessments: [MarketAssessmentType]

  @Field(() => [AssessmentType], {
    ...NullableTrue,
    description:
      'Tax assessment information as provided by the county assessor. These assessments are used exclusively for taxation purposes.',
  })
  assessments: [AssessmentType]

  @Field(() => [TaxType], {
    ...NullableTrue,
    description: 'Tax records as provided by the county.',
  })
  taxes: [TaxType]

  @Field(() => ValuationType, {
    ...NullableTrue,
    description: 'Valuation details as provided by a proprietary valuation algorithm.',
  })
  valuation: ValuationType

  @Field(() => StructureType, {
    ...NullableTrue,
    description: 'Information about the building(s) on the parcel.',
  })
  structure: StructureType

  @Field(() => BoundaryType, {
    ...NullableTrue,
    description: 'Coordinates along a parcels boundary.',
  })
  boundary: BoundaryType

  @Field(() => ParcelType, {
    ...NullableTrue,
    description: 'Parcel details as provided by the assessor.',
  })
  parcel: ParcelType

  @Field(() => AddressType, {
    ...NullableTrue,
    description: 'Address details as provided by the assessor.',
  })
  address?: AddressType

  @Field(() => MetadataType, {
    ...NullableTrue,
    description: 'Metadata related to the request.',
  })
  metadata: MetadataType

  @Field({ ...NullableTrue, description: 'youtube link' })
  youtubeLink?: string

  @Field({ ...NullableTrue, description: 'meta link' })
  metaLink?: string

  @Field({ ...NullableTrue, description: 'meta link revenue field' })
  metaLandRevenueStream: string

  @Field({ ...NullableTrue, description: 'token id' })
  tokenId: string

  @Field({ ...NullableTrue, description: 'token smart contract url' })
  tokenSmartContractUrl: string

  @Field({ ...NullableTrue, description: 'property description' })
  propertyDescription: string

  @Field({ ...NullableTrue, description: 'additional perks' })
  additionalPerks: string

  @Field({ ...NullableTrue, description: 'company name' })
  companyName: string

  @Field({ ...NullableTrue, description: 'closing date' })
  closingDate?: string

  @Field({ ...NullableTrue, description: 'offering memorandum date' })
  offeringMemorandumDate?: string
}

@ObjectType(TypeName.RealEstateBasicInfoType)
export class ReFullListingType extends IntersectionType(
  PartialType(RealEstateListingType),
  NoPropertFoundType,
) {}

@ObjectType(TypeName.RealEstateFinanceType)
export class ReFullLisTwithFinanceType extends PropertyFinancial {
  @Field({ ...NullableTrue })
  @IsUUID(UUID_VERSION)
  re_id?: string
  @Field({ ...NullableTrue })
  @IsUUID(UUID_VERSION)
  user_id?: string
}

/*

city: "TAMPA"
    state: "FL"
    street_address: "15260 ANGUILLA ISLE AVE"
    userId: "a6d98d0b-6aa3-4537-b789-b8a5a15c927d"
    zip_code: 33648
  */

@ObjectType(TypeName.UpdateSmartContractAndAdditionalInfoType)
export class UpdateSmartContractType {
  @Field({ ...NullableFalse, description: 'reid' })
  @IsUUID(UUID_VERSION)
  re_id: string

  @Field({ ...NullableFalse, description: 'tokenId' })
  tokenId: string

  @Field({ ...NullableFalse, description: 'tokenSmartContractUrl' })
  tokenSmartContractUrl: string

  @Field({ ...NullableFalse, description: 'propertyDescription' })
  propertyDescription: string

  @Field({ ...NullableFalse, description: 'additionalPerks' })
  additionalPerks: string

  @Field({ ...NullableFalse, description: 'company name' })
  companyName: string

  @Field({ ...NullableFalse, description: 'closing date' })
  closingDate?: string

  @Field({ ...NullableFalse, description: 'offering memorandum date' })
  offeringMemorandumDate?: string
}

@ObjectType(TypeName.RealEstateAndFinanceType)
export class RealEstateAndFinanceType extends PropertyFinancial {
  @Field({ ...NullableTrue, description: 'registration id' })
  re_id?: string

  @Field(() => [DeedType], {
    ...NullableTrue,
    description:
      'Up to 40 years of sale and mortgage data which constitute a deed record.',
  })
  deeds: [DeedType]

  @Field(() => OwnerType, {
    ...NullableTrue,
    description: 'Current owner details taken from the assessment.',
  })
  owner: OwnerType

  @Field(() => [MarketAssessmentType], {
    ...NullableTrue,
    description:
      'Market assessment data as determined by the assessor. These assessments indicate an approximate market value of a property.',
  })
  market_assessments: [MarketAssessmentType]

  @Field(() => [AssessmentType], {
    ...NullableTrue,
    description:
      'Tax assessment information as provided by the county assessor. These assessments are used exclusively for taxation purposes.',
  })
  assessments: [AssessmentType]

  @Field(() => [TaxType], {
    ...NullableTrue,
    description: 'Tax records as provided by the county.',
  })
  taxes: [TaxType]

  @Field(() => ValuationType, {
    ...NullableTrue,
    description: 'Valuation details as provided by a proprietary valuation algorithm.',
  })
  valuation: ValuationType

  @Field(() => StructureType, {
    ...NullableTrue,
    description: 'Information about the building(s) on the parcel.',
  })
  structure: StructureType

  @Field(() => BoundaryType, {
    ...NullableTrue,
    description: 'Coordinates along a parcels boundary.',
  })
  boundary: BoundaryType

  @Field(() => ParcelType, {
    ...NullableTrue,
    description: 'Parcel details as provided by the assessor.',
  })
  parcel: ParcelType

  @Field(() => AddressType, {
    ...NullableTrue,
    description: 'Address details as provided by the assessor.',
  })
  address?: AddressType

  @Field(() => MetadataType, {
    ...NullableTrue,
    description: 'Metadata related to the request.',
  })
  metadata: MetadataType

  @Field({ ...NullableTrue, description: 'youtube link' })
  youtubeLink?: string

  @Field({ ...NullableTrue, description: 'meta link' })
  metaLink?: string

  @Field({ ...NullableTrue, description: 'meta link revenue field' })
  metaLandRevenueStream: string

  @Field({ ...NullableTrue, description: 'token id' })
  tokenId: string

  @Field({ ...NullableTrue, description: 'token smart contract url' })
  tokenSmartContractUrl: string

  @Field({ ...NullableTrue, description: 'property description' })
  propertyDescription: string

  @Field({ ...NullableTrue, description: 'additional perks' })
  additionalPerks: string

  @Field({ ...NullableTrue, description: 'company name' })
  companyName: string

  @Field({ ...NullableTrue, description: 'closing date' })
  closingDate?: string

  @Field({ ...NullableTrue, description: 'offering memorandum date' })
  offeringMemorandumDate?: string
}

@ObjectType('StartType')
export class StartType {
  @Field({ ...NullableTrue, description: 'partition key' })
  pk?: string

  @Field({ ...NullableTrue, description: 'sort key' })
  sk?: string
}
// Pagination:
// @ObjectType('ReDataPaginated')
// export class ReDataPaginated extends CommonType {

@ObjectType('RealEstateAndFinanceType1')
export class RealEstateAndFinanceType1 extends CommonType {
  @Field({ ...NullableTrue, description: 'registration id' })
  re_id?: string

  @Field(() => String, {
    ...NullableTrue,
    description: 'address',
  })
  address: string

  @Field(() => Float, { ...NullableTrue, description: 'Number of tokens.' })
  totalNumberOfTokens: number

  @Field(() => Float, { ...NullableTrue, description: 'Token price' })
  tokenPrice: number

  @Field(() => Float, { ...NullableTrue, description: 'Listing price of the property' })
  listingPrice: string

  @Field(() => Float, { ...NullableTrue, description: 'Expected Net Roi per property' })
  expectedNetRoi: string

  @Field(() => Int, { ...NullableTrue, description: 'available tokens.' })
  tokensRemaining: string
}

/* @ObjectType('RealEstateAndFinanceType1')
export class RealEstateAndFinanceType1 {
  @Field(() => [ReDataPaginated], { ...NullableTrue, description: 'available tokens.' })
  reData: [ReDataPaginated]

  @Field(() => StartType, { ...NullableTrue, description: 'available tokens.' })
  nextCursor: StartType
} */
