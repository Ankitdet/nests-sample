import { getInputName, InputName } from '@core/enums'
import { ArgsType, Field, Float, InputType, Int } from '@nestjs/graphql'
import { NullableFalse, NullableTrue, UUID_VERSION } from '@utils/common.utils'
import { IsUUID } from 'class-validator'

@InputType(getInputName(InputName.ReIdInput))
@ArgsType()
export class ReIdInput {
  @Field({ description: 'real estate id.', nullable: false })
  @IsUUID(UUID_VERSION)
  re_id: string
}

@InputType(getInputName(InputName.TokenCreateInput))
@ArgsType()
export class TokenCreateInput {
  // Total Investments
  @Field(() => Int, { description: 'Buying fees of the property', nullable: false })
  buyingFees: number
  @Field(() => Int, { description: 'Buying Price of the property', nullable: false })
  buyingPrice?: number
  @Field(() => Int, {
    description: 'Expected reserve fund of the property',
    nullable: false,
  })
  expectedReserveFunds?: number
  @Field(() => Int, {
    description: 'Renovation costs of the property',
    nullable: false,
  })
  renovationCosts?: number

  // Expenses
  @Field(() => Int, { description: ' property tax', nullable: false })
  propertyTaxes?: number
  @Field(() => Int, { description: ' property insurance', nullable: false })
  insurance?: number
  @Field(() => Int, { description: ' property utilities', nullable: false })
  utilities?: number
  @Field(() => Int, {
    description: ' expected gross rent per property',
    nullable: false,
  })
  expectedGrossRentPerProperty?: number
}

@InputType(getInputName(InputName.ReAddressInput))
@ArgsType()
class ReAddressInput {
  @Field({ ...NullableTrue, description: ' Parsed street number.' })
  street_number?: string
  @Field({
    ...NullableTrue,
    description: ' Directional appearing before the street name.',
  })
  street_pre_direction?: string
  @Field({
    ...NullableTrue,
    description:
      ' Parsed street name. Numeric street names will include ordinal suffixes (st, nd, rd, th)',
  })
  street_name?: string
  @Field({
    ...NullableTrue,
    description: ' Standardized and parsed street suffix abbreviation.',
  })
  street_suffix?: string
  @Field({
    ...NullableTrue,
    description: ' Directional appearing after street suffix denoting quadrant.',
  })
  street_post_direction?: string
  @Field({ ...NullableTrue, description: 'Unit type abbreviation.' })
  unit_type?: string
  @Field({ ...NullableTrue, description: ' Unit number (may be alphanumeric).' })
  unit_number?: string
  @Field({
    ...NullableFalse,
    description: ' Combined street address (including unit).',
  })
  streetAddress?: string
  @Field({ ...NullableFalse, description: ' City name.' })
  city?: string
  @Field({ ...NullableFalse, description: 'State abbreviation.' })
  state?: string
  @Field({ ...NullableFalse, description: 'Zip code.' })
  zipCode?: string
  @Field({ ...NullableTrue, description: 'Four digit postal zip extension.' })
  zip_plus_four_code?: string
  @Field({ ...NullableTrue, description: 'USPS code for mail delivery services.' })
  carrier_code?: string
  @Field({ ...NullableTrue, description: 'Measured latitude for the property.' })
  latitude?: number
  @Field({ ...NullableTrue, description: 'Measured longitude for the property.' })
  longitude?: number
  @Field({ ...NullableTrue, description: 'Describes the level of geocoding match.' })
  geocoding_accuracy?: string
  @Field({
    ...NullableTrue,
    description: 'The census tract as designated by the Census Bureau.',
  })
  census_tract?: string
}

@InputType(getInputName(InputName.DeedInput))
@ArgsType()
class DeedInput {
  @Field({ ...NullableTrue, description: 'Type of deed document.' })
  document_type?: string
  @Field({
    ...NullableTrue,
    description: 'The official date the document was recorded.',
  })
  recording_date?: string
  @Field({
    ...NullableTrue,
    description:
      'The date the original contract was signed by the relevant parties. In some scenarios this may be the date of notarization.',
  })
  original_contract_date?: string
  @Field({
    ...NullableTrue,
    description: 'The physical book where the deed was recorded.',
  })
  deed_book?: string
  @Field({
    ...NullableTrue,
    description: 'The physical page where the deed was recorded.',
  })
  deed_page?: string
  @Field({
    ...NullableTrue,
    description: 'Identifier assigned to document at the recording date.',
  })
  document_id?: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The total sale price in dollars.',
  })
  sale_price?: number
  @Field({ ...NullableTrue, description: 'A description of the sale.' })
  sale_price_description?: string
  @Field(() => Float, {
    ...NullableTrue,
    description: 'The tax amount levied by the city, county, or a combination thereof.',
  })
  transfer_tax?: number
  @Field({
    ...NullableTrue,
    description: 'An indicator to determine if the sale was deemed to be distressed.',
  })
  distressed_sale?: boolean
  @Field({
    ...NullableTrue,
    description: 'An indicator used to determine the status of the transfer.',
  })
  real_estate_owned?: string
  @Field({
    ...NullableTrue,
    description: 'Seller first name, or null if corporate owner.',
  })
  seller_first_name?: string
  @Field({ ...NullableTrue, description: 'Seller last name, or corporate name.' })
  seller_last_name?: string
  @Field({
    ...NullableTrue,
    description: 'The second seller first name, or null if corporate owner.',
  })
  seller2_first_name?: string
  @Field({
    ...NullableTrue,
    description: 'The second seller last name, or corporate name.',
  })
  seller2_last_name?: string
  @Field({ ...NullableTrue, description: 'The seller mailing address.' })
  seller_address?: string
  @Field({ ...NullableTrue, description: 'The seller unit number.' })
  seller_unit_number?: string
  @Field({ ...NullableTrue, description: 'The seller city.' })
  seller_city?: string
  @Field({ ...NullableTrue, description: 'The seller mailing state.' })
  seller_state?: string
  @Field({ ...NullableTrue, description: 'Seller zip code.' })
  seller_zip_code?: string
  @Field({ ...NullableTrue, description: 'Seller four digit postal zip extension.' })
  seller_zip_plus_four_code?: string
  @Field({
    ...NullableTrue,
    description: 'Buyer first name, or null if corporate owner.',
  })
  buyer_first_name?: string
  @Field({ ...NullableTrue, description: 'Buyer last name, or corporate name.' })
  buyer_last_name?: string
  @Field({
    ...NullableTrue,
    description: 'Second buyer first name, or null if corporate owner.',
  })
  buyer2_first_name?: string
  @Field({ ...NullableTrue, description: 'Second buyer last name, or corporate name.' })
  buyer2_last_name?: string
  @Field({ ...NullableTrue, description: 'Buyer mailing address.' })
  buyer_address?: string
  @Field({ ...NullableTrue, description: 'Buyer unit type.' })
  buyer_unit_type?: string
  @Field({ ...NullableTrue, description: 'Buyer unit number.' })
  buyer_unit_number?: string
  @Field({ ...NullableTrue, description: 'Buyer mailing city.' })
  buyer_city?: string
  @Field({ ...NullableTrue, description: 'Buyer mailing state.' })
  buyer_state?: string
  @Field({ ...NullableTrue, description: 'Buyer mailing zip code.' })
  buyer_zip_code?: string
  @Field({ ...NullableTrue, description: 'Buyer four digit postal zip extension.' })
  buyer_zip_plus_four_code?: string
  @Field({ ...NullableTrue, description: 'Mortgage lender.' })
  lender_name?: string
  @Field({ ...NullableTrue, description: 'The type of lender.' })
  lender_type?: string
  @Field(() => Int, { ...NullableTrue, description: 'Mortgage recorded in dollars.' })
  loan_amount?: number
  @Field({ ...NullableTrue, description: 'Type of loan security.' })
  loan_type?: string
  @Field({
    ...NullableTrue,
    description: 'The date the mortgage will be paid in full.',
  })
  loan_due_date?: string
  @Field({ ...NullableTrue, description: 'The interest rate type on the loan.' })
  loan_finance_type?: string
  @Field(() => Float, {
    ...NullableTrue,
    description: 'The interest rate of the loan.',
  })
  loan_interest_rate?: number
}

@InputType('OwnerInput')
@ArgsType()
class OwnerInput {
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
  owner_occupied?: string
}

@InputType('MarketAssessmentInput')
@ArgsType()
class MarketAssessmentInput {
  @Field(() => Int, { ...NullableTrue, description: 'Year of assessment' })
  year?: number
  @Field(() => Int, { ...NullableTrue, description: 'Land Value of Assessment' })
  land_value?: number
  @Field(() => Int, { ...NullableTrue, description: 'Improvement value of Land' })
  improvement_value?: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Total Market assessment of Land ',
  })
  total_value?: number
}

@InputType('AssessmentInput')
@ArgsType()
class AssessmentInput {
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The year the assessment was performed.',
  })
  year?: number
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
  total_value?: number
}

@InputType('TaxInput')
@ArgsType()
class TaxInput {
  @Field(() => Int, { ...NullableTrue, description: 'The year the tax was levied.' })
  year?: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The amount of tax on the property in dollars.',
  })
  amount?: number
  @Field(() => [String], { ...NullableTrue, description: 'List of exemptions.' })
  exemptions?: [string]
  @Field({
    ...NullableTrue,
    description:
      'Represents separate tax jurisdictions within the county as provided on the county tax/assessment roll.',
  })
  rate_code_area?: string
}

@InputType('ValuationInput')
@ArgsType()
class ValuationInput {
  @Field(() => Int, { ...NullableTrue, description: 'The current property value.' })
  value?: number
  @Field(() => Int, { ...NullableTrue, description: 'The highest probable value.' })
  high?: number
  @Field(() => Int, { ...NullableTrue, description: 'The lowest probable value.' })
  low?: number
  @Field(() => Int, { ...NullableTrue, description: 'Forecast standard deviation.' })
  forecast_standard_deviation?: number
  @Field({ ...NullableTrue, description: 'The date the valuation was performed.' })
  date?: string
}

@InputType('OtherAreaInput')
@ArgsType()
class OtherAreaInput {
  @Field({ ...NullableTrue, description: 'Area' })
  type?: string
  @Field({ ...NullableTrue, description: 'square feet' })
  sq_ft?: string
}

@InputType('StructureInput')
@ArgsType()
class StructureInput {
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The year the structure was built.',
  })
  year_built?: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The year a structure was substantially updated or improved.',
  })
  effective_year_built?: number
  @Field({
    ...NullableTrue,
    description:
      'The number of stories comprising the structure (may include fractional stories and alphabetic codes).',
  })
  stories?: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The total number of rooms in the building (not just bedrooms).',
  })
  rooms_count?: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'The number of bedrooms in the building.',
  })
  beds_count?: number
  @Field(() => Float, {
    ...NullableTrue,
    description:
      'Fractional number of bathrooms in the building, except when partial_baths_count is nonnull.',
  })
  baths?: number
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
  units_count?: number
  @Field({ ...NullableTrue, description: 'The type of parking available.' })
  parking_type?: string
  @Field(() => Int, {
    ...NullableTrue,
    description:
      'The total number of available parking spaces; including garage, carport, driveway.',
  })
  parking_spaces_count?: number
  @Field({
    ...NullableTrue,
    description: 'Type of pool located on the property - shared or private.',
  })
  pool_type?: string
  @Field({
    ...NullableTrue,
    description: 'Style or historical period of the primary structure.',
  })
  architecture_type?: string
  @Field({
    ...NullableTrue,
    description: 'Type of material used in construction of the building.',
  })
  construction_type?: string
  @Field({
    ...NullableTrue,
    description: 'Material used for the exterior walls of the building.',
  })
  exterior_wall_type?: string
  @Field({
    ...NullableTrue,
    description: 'The type of material used in the foundation.',
  })
  foundation_type?: string
  @Field({
    ...NullableTrue,
    description: 'The material used for the roof of the building.',
  })
  roof_material_type?: string
  @Field({
    ...NullableTrue,
    description: 'The architectural style for the roof of the building.',
  })
  roof_style_type?: string
  @Field({ ...NullableTrue, description: 'Primary heating type for the building.' })
  heating_type?: string
  @Field({ ...NullableTrue, description: 'Type of fuel used to heat the building.' })
  heating_fuel_type?: string
  @Field({ ...NullableTrue, description: 'Air conditioning type for the building.' })
  air_conditioning_type?: string
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
  quality?: string
  @Field({
    ...NullableTrue,
    description:
      'Current condition of the structure provided by the county. This relates to things like whether or not there is visible wear on the structure (e.g. chipped paint, siding falling off). The method for determining this varies across counties.',
  })
  condition?: string
  @Field(() => [String], {
    ...NullableTrue,
    description: 'Type of flooring used in improvements in the building.',
  })
  flooring_types?: [string]
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Total number of all plumbing fixtures in the building.',
  })
  plumbing_fixtures_count?: number
  @Field({
    ...NullableTrue,
    description: 'The type of material used for the interior walls.',
  })
  interior_wall_type?: string
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
  total_area_sq_ft?: number
  @Field(() => [OtherAreaInput], {
    ...NullableTrue,
    description:
      'List of objects describing areas within the building, and their corresponding size in sq ft. Size is a string holding an integer.',
  })
  other_areas?: [OtherAreaInput]
  @Field(() => [String], {
    ...NullableTrue,
    description: 'List of other rooms within the building.',
  })
  other_rooms?: [string]
  @Field(() => [OtherAreaInput], {
    ...NullableTrue,
    description:
      'List of objects describing features in or around the building, and their corresponding size in sq ft. Size is a string holding an integer, float, or rectangle (e.g. "24X16").',
  })
  other_features?: [OtherAreaInput]
  @Field(() => [OtherAreaInput], {
    ...NullableTrue,
    description:
      'List of objects describing improvements to the property or building, and their corresponding size in sq ft. Size is a string holding an integer, float, or rectangle (e.g. "24X16").',
  })
  other_improvements?: OtherAreaInput[]
  @Field(() => [String], {
    ...NullableTrue,
    description: 'List of amenities included in the property.',
  })
  amenities?: [string]
}

@InputType('GeojsonInput')
@ArgsType()
class GeojsonInput {
  @Field({ ...NullableTrue, description: 'Geojson Input type' })
  type?: string
  @Field(() => [[[Float]]], { ...NullableTrue, description: 'Co-ordinates' })
  coordinates?: number[][][]
}

@InputType('BoundaryInput')
@ArgsType()
class BoundaryInput {
  @Field({
    ...NullableTrue,
    description:
      'The Well-Known Text representation of the boundary as a multipolygon. For use with GIS software.',
  })
  wkt?: string
  @Field(() => GeojsonInput, {
    ...NullableTrue,
    description: 'For a parsed representation of the boundary.',
  })
  geojson?: GeojsonInput
}

@InputType('ParcelInput')
@ArgsType()
class ParcelInput {
  @Field({ ...NullableTrue, description: 'The formatted assessors parcel number.' })
  apn_original?: string
  @Field({ ...NullableTrue, description: 'The unformatted assessors parcel number.' })
  apn_unformatted?: string
  @Field({
    ...NullableTrue,
    description: 'A previous assessors parcel number, formatted.',
  })
  apn_previous?: string
  @Field({
    ...NullableTrue,
    description: 'Unique County identifier, first 2 digits are state FIPS.',
  })
  fips_code?: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Frontage measurement of the parcel in feet.',
  })
  frontage_ft?: number
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Depth measurement of the parcel in feet.',
  })
  depth_ft?: number
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Total area of the parcel in square feet.',
  })
  area_sq_ft?: number
  @Field(() => Float, {
    ...NullableTrue,
    description: 'Total area of the parcel in acres.',
  })
  area_acres?: number
  @Field({ ...NullableTrue, description: 'The name of the county.' })
  county_name?: string
  @Field({
    ...NullableTrue,
    description:
      'The land use code as provided directly from the county, without interpretation.',
  })
  county_land_use_code?: string
  @Field({
    ...NullableTrue,
    description:
      'The land use description as provided by directly from the county, without interpretation.',
  })
  county_land_use_description?: string
  @Field({
    ...NullableTrue,
    description:
      'The general land use category for the property, converted to a common set of values across all counties.',
  })
  standardized_land_use_category?: string
  @Field({
    ...NullableTrue,
    description:
      'Describes further granularity into the land use type, converted to a common set of values across all counties.',
  })
  standardized_land_use_type?: string
  @Field(() => [String], {
    ...NullableTrue,
    description: 'List describing the location and surrounding area',
  })
  location_descriptions?: string[]
  @Field({
    ...NullableTrue,
    description: 'City zoning designation, unique to each incorporated area.',
  })
  zoning?: string
  @Field(() => Int, {
    ...NullableTrue,
    description: 'Count of all buildings on the property.',
  })
  building_count?: number
  @Field({
    ...NullableTrue,
    description: 'Parcel identifier used by the tax assessor.',
  })
  tax_account_number?: string
  @Field({
    ...NullableTrue,
    description: 'Legal description as provided by the assessor.',
  })
  legal_description?: string
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
  lot_number?: string
  @Field({
    ...NullableTrue,
    description:
      'The name of the subdivision, plat, or tract in which the property is located',
  })
  subdivision?: string
  @Field({
    ...NullableTrue,
    description: 'The jurisdiction in which the property is located.',
  })
  municipality?: string
  @Field({
    ...NullableTrue,
    description: 'Section township range meridian identifier.',
  })
  section_township_range?: string
}

@InputType('MetadataInput')
@ArgsType()
class MetadataInput {
  @Field({ ...NullableTrue, description: 'Metadata related to the request.' })
  publishing_date?: string
}

@InputType('RealEstateListingInput')
@ArgsType()
export class RealEstateListingInput {
  @Field({ ...NullableTrue, description: 'user id' })
  @IsUUID(UUID_VERSION)
  user_id?: string

  @Field(() => [DeedInput], {
    ...NullableTrue,
    description:
      'Up to 40 years of sale and mortgage data which constitute a deed record.',
  })
  deeds?: [DeedInput]

  @Field(() => OwnerInput, {
    ...NullableTrue,
    description: 'Current owner details taken from the assessment.',
  })
  owner?: OwnerInput

  @Field(() => [MarketAssessmentInput], {
    ...NullableTrue,
    description:
      'Market assessment data as determined by the assessor. These assessments indicate an approximate market value of a property.',
  })
  market_assessments?: [MarketAssessmentInput]

  @Field(() => [AssessmentInput], {
    ...NullableTrue,
    description:
      'Tax assessment information as provided by the county assessor. These assessments are used exclusively for taxation purposes.',
  })
  assessments?: [AssessmentInput]

  @Field(() => [TaxInput], {
    ...NullableTrue,
    description: 'Tax records as provided by the county.',
  })
  taxes?: [TaxInput]

  @Field(() => ValuationInput, {
    ...NullableTrue,
    description: 'Valuation details as provided by a proprietary valuation algorithm.',
  })
  valuation?: ValuationInput

  @Field(() => StructureInput, {
    ...NullableTrue,
    description: 'Information about the building(s) on the parcel.',
  })
  structure?: StructureInput

  @Field(() => BoundaryInput, {
    ...NullableTrue,
    description: 'Coordinates along a parcels boundary.',
  })
  boundary?: BoundaryInput

  @Field(() => ParcelInput, {
    ...NullableTrue,
    description: 'Parcel details as provided by the assessor.',
  })
  parcel?: ParcelInput

  @Field(() => ReAddressInput, {
    ...NullableFalse,
    description: 'Address details as provided by the assessor.',
  })
  address?: ReAddressInput

  @Field(() => MetadataInput, {
    ...NullableTrue,
    description: 'Metadata related to the request.',
  })
  metadata?: MetadataInput

  @Field({ ...NullableTrue, description: ' Property created at' })
  createdAt?: string

  @Field({ ...NullableTrue, description: 'Property updated at' })
  updatedAt?: string

  @Field({ ...NullableTrue, description: 'youtube link' })
  youtubeLink?: string

  @Field({ ...NullableTrue, description: 'meta link' })
  metaLink?: string

  @Field({ ...NullableFalse, description: 'meta link revenue field' })
  metaLandRevenueStream: string

  constructor(data?: Partial<RealEstateListingInput>) {
    Object.assign(this, data)
  }
}

@InputType('StartKeyInput')
@ArgsType()
export class StartKeyInput {
  @Field({ ...NullableTrue, description: 'partition key' })
  pk?: string

  @Field({ ...NullableTrue, description: 'sory key' })
  sk?: string

  @Field({ ...NullableTrue, description: 'gsi1 sk' })
  gsi1_sk?: string

  @Field({ ...NullableTrue, description: 'gsi1 pk' })
  gsi1_pk?: string

  @Field({ ...NullableTrue, description: 'gsi2 sk' })
  gsi2_sk?: string

  @Field({ ...NullableTrue, description: 'gsi2 pk' })
  gsi2_pk?: string

  constructor(data?: Partial<StartKeyInput>) {
    Object.assign(this, data)
  }
}
