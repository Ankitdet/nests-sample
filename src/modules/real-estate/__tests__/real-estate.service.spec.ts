import { FetchPropertyInput } from '@core/args'
import { LoggerService } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { RealEstateService } from '../real-estate.service'
const data = {
  deeds: [
    {
      document_type: 'WARRANTY DEED',
      recording_date: '2021-07-13',
      original_contract_date: '2021-07-12',
      deed_book: null,
      deed_page: null,
      document_id: '2021350195',
      sale_price: 435000,
      sale_price_description: 'FULL AMOUNT STATED ON DOCUMENT',
      transfer_tax: 3045,
      distressed_sale: false,
      real_estate_owned: 'NO',
      seller_first_name: null,
      seller_last_name: 'OP SPE TPA1 LLC',
      seller2_first_name: null,
      seller2_last_name: null,
      seller_address: '2150 E GERMANN RD',
      seller_unit_number: '1',
      seller_city: 'CHANDLER',
      seller_state: 'AZ',
      seller_zip_code: '85286',
      seller_zip_plus_four_code: '1662',
      buyer_first_name: null,
      buyer_last_name: 'CASA DEJA LLC',
      buyer2_first_name: null,
      buyer2_last_name: null,
      buyer_address: null,
      buyer_unit_type: null,
      buyer_unit_number: null,
      buyer_city: null,
      buyer_state: null,
      buyer_zip_code: null,
      buyer_zip_plus_four_code: null,
      lender_name: null,
      lender_type: null,
      loan_amount: null,
      loan_type: null,
      loan_due_date: null,
      loan_finance_type: null,
      loan_interest_rate: null,
    },
    {
      document_type: 'WARRANTY DEED',
      recording_date: '2021-06-01',
      original_contract_date: '2021-05-27',
      deed_book: null,
      deed_page: null,
      document_id: '2021274364',
      sale_price: 359600,
      sale_price_description:
        'SALES PRICE OR TRANSFER TAX ROUNDED BY COUNTY PRIOR TO COMPUTATION',
      transfer_tax: 2517.2,
      distressed_sale: false,
      real_estate_owned: 'NO',
      seller_first_name: 'SONY',
      seller_last_name: 'SAM',
      seller2_first_name: 'TINA M',
      seller2_last_name: 'THOMSON',
      seller_address: '17933 CACHET ISLE DR',
      seller_unit_number: null,
      seller_city: 'TAMPA',
      seller_state: 'FL',
      seller_zip_code: '33647',
      seller_zip_plus_four_code: '2703',
      buyer_first_name: null,
      buyer_last_name: 'OP SPE TPA1 LLC',
      buyer2_first_name: null,
      buyer2_last_name: null,
      buyer_address: '2150 E GERMANN RD',
      buyer_unit_type: 'STE',
      buyer_unit_number: '1',
      buyer_city: 'CHANDLER',
      buyer_state: 'AZ',
      buyer_zip_code: '85286',
      buyer_zip_plus_four_code: '1662',
      lender_name: null,
      lender_type: null,
      loan_amount: null,
      loan_type: null,
      loan_due_date: null,
      loan_finance_type: null,
      loan_interest_rate: null,
    },
    {
      document_type: 'SPECIAL WARRANTY DEED',
      recording_date: '2016-11-23',
      original_contract_date: '2016-11-21',
      deed_book: '24547',
      deed_page: '0789',
      document_id: '2016461388',
      sale_price: 316900,
      sale_price_description:
        'SALES PRICE OR TRANSFER TAX ROUNDED BY COUNTY PRIOR TO COMPUTATION',
      transfer_tax: 2218.3,
      distressed_sale: false,
      real_estate_owned: 'NO',
      seller_first_name: null,
      seller_last_name: 'NVR INC',
      seller2_first_name: null,
      seller2_last_name: null,
      seller_address: '1409 TECH BLVD',
      seller_unit_number: '202',
      seller_city: 'TAMPA',
      seller_state: 'FL',
      seller_zip_code: '33619',
      seller_zip_plus_four_code: '7830',
      buyer_first_name: 'SONY',
      buyer_last_name: 'SAM',
      buyer2_first_name: 'TINA M',
      buyer2_last_name: 'THOMPSON',
      buyer_address: '15260 ANGUILLA ISLE AVE',
      buyer_unit_type: null,
      buyer_unit_number: null,
      buyer_city: 'TAMPA',
      buyer_state: 'FL',
      buyer_zip_code: '33647',
      buyer_zip_plus_four_code: '3723',
      lender_name: 'CALIBER HOME LOANS INC',
      lender_type: 'MORTGAGE COMPANY',
      loan_amount: 301007,
      loan_type: 'NEW CONVENTIONAL',
      loan_due_date: '2031-12-01',
      loan_finance_type: null,
      loan_interest_rate: null,
    },
    {
      document_type: 'SPECIAL WARRANTY DEED',
      recording_date: '2016-01-27',
      original_contract_date: '2016-01-21',
      deed_book: '23841',
      deed_page: '0831',
      document_id: '2016037508',
      sale_price: 268600,
      sale_price_description:
        'SALES PRICE OR TRANSFER TAX ROUNDED BY COUNTY PRIOR TO COMPUTATION',
      transfer_tax: 1880.2,
      distressed_sale: false,
      real_estate_owned: 'NO',
      seller_first_name: null,
      seller_last_name: 'KLP CORY LAKES LLC',
      seller2_first_name: null,
      seller2_last_name: null,
      seller_address: '8875 HIDDEN RIVER PKWY',
      seller_unit_number: '150',
      seller_city: 'TAMPA',
      seller_state: 'FL',
      seller_zip_code: '33637',
      seller_zip_plus_four_code: '1030',
      buyer_first_name: null,
      buyer_last_name: 'NVR INC',
      buyer2_first_name: null,
      buyer2_last_name: null,
      buyer_address: '4307 VINELAND RD',
      buyer_unit_type: 'STE',
      buyer_unit_number: 'H20',
      buyer_city: 'ORLANDO',
      buyer_state: 'FL',
      buyer_zip_code: '32811',
      buyer_zip_plus_four_code: '7374',
      lender_name: null,
      lender_type: null,
      loan_amount: null,
      loan_type: null,
      loan_due_date: null,
      loan_finance_type: null,
      loan_interest_rate: null,
    },
  ],
  owner: {
    name: 'CASA DEJA LLC,',
    second_name: null,
    unit_type: null,
    unit_number: null,
    formatted_street_address: null,
    city: null,
    state: null,
    zip_code: null,
    zip_plus_four_code: null,
    owner_occupied: 'YES',
  },
  market_assessments: [
    {
      year: 2021,
      land_value: 52120,
      improvement_value: 212710,
      total_value: 264830,
    },
  ],
  assessments: [
    {
      year: 2021,
      land_value: 52120,
      improvement_value: 212710,
      total_value: 264830,
    },
    {
      year: 2020,
      land_value: null,
      improvement_value: null,
      total_value: 274585,
    },
    {
      year: 2019,
      land_value: null,
      improvement_value: null,
      total_value: 260670,
    },
    {
      year: 2018,
      land_value: null,
      improvement_value: null,
      total_value: 255810,
    },
  ],
  taxes: [
    {
      year: 2021,
      amount: 8181,
      exemptions: ['HOMESTEAD'],
      rate_code_area: 'TA',
    },
  ],
  valuation: {
    value: 446000,
    high: 481680,
    low: 410320,
    forecast_standard_deviation: 8,
    date: '2022-01-05',
  },
  structure: {
    year_built: 2016,
    effective_year_built: 2018,
    stories: '2',
    rooms_count: null,
    beds_count: 5,
    baths: 3.5,
    partial_baths_count: null,
    units_count: 1,
    parking_type: 'GARAGE',
    parking_spaces_count: 2,
    pool_type: null,
    architecture_type: 'CONTEMPORARY',
    construction_type: 'MASONRY',
    exterior_wall_type: 'STUCCO',
    foundation_type: null,
    roof_material_type: 'COMPOSITION SHINGLE',
    roof_style_type: 'GABLE OR HIP',
    heating_type: 'CENTRAL',
    heating_fuel_type: null,
    air_conditioning_type: 'CENTRAL',
    fireplaces: null,
    basement_type: null,
    quality: 'C+',
    condition: 'AVERAGE',
    flooring_types: ['CARPET', 'TILE'],
    plumbing_fixtures_count: null,
    interior_wall_type: 'GYPSUM BOARD',
    water_type: null,
    sewer_type: null,
    total_area_sq_ft: 3247,
    other_areas: [
      {
        type: 'BASE AREA',
        sq_ft: '1128',
      },
      {
        type: 'UPPER STORY FINISHED',
        sq_ft: '1749',
      },
      {
        type: 'EFFECTIVE AREA',
        sq_ft: '3334',
      },
      {
        type: 'GROSS AREA',
        sq_ft: '3953',
      },
      {
        type: 'GARAGE FINISHED',
        sq_ft: '641',
      },
      {
        type: 'ENCLOSED PORCH',
        sq_ft: '370',
      },
      {
        type: 'COVERED PORCH',
        sq_ft: '65',
      },
    ],
    other_rooms: [],
    other_features: [],
    other_improvements: [],
    amenities: [],
  },
  boundary: {
    wkt: 'MULTIPOLYGON(((-82.2918635951288 28.134598098723302,-82.2917084728677 28.13459999359486,-82.2917041489273 28.134319152406988,-82.29185927028908 28.13431727102528,-82.2918635951288 28.134598098723302)))',
    geojson: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-82.2918635951288, 28.1345980987233],
            [-82.2917084728677, 28.1345999935949],
            [-82.2917041489273, 28.134319152407],
            [-82.2918592702891, 28.1343172710253],
            [-82.2918635951288, 28.1345980987233],
          ],
        ],
      ],
    },
  },
  parcel: {
    apn_original: 'A1527209U9000000000370',
    apn_unformatted: 'A1527209U9000000000370',
    apn_previous: null,
    fips_code: '12057',
    frontage_ft: 50,
    depth_ft: 82.1,
    area_sq_ft: 4977,
    area_acres: 0.114,
    county_name: 'HILLSBOROUGH',
    county_land_use_code: '01',
    county_land_use_description: 'SINGLE FAMILY',
    standardized_land_use_category: 'RESIDENTIAL',
    standardized_land_use_type: 'SINGLE FAMILY RESIDENTIAL',
    location_descriptions: [],
    zoning: 'PD',
    building_count: null,
    tax_account_number: '0593963174',
    legal_description: 'CAPRI ISLE AT CORY LAKE LOT 37',
    lot_code: null,
    lot_number: '37',
    subdivision: 'CAPRI ISLE AT CORY LAKE',
    municipality: 'CITY OF TAMPA',
    section_township_range: 'SEC 15 TWN 27S RNG 20E',
  },
  address: {
    street_number: '15260',
    street_pre_direction: null,
    street_name: 'ANGUILLA ISLE',
    street_suffix: 'AVE',
    street_post_direction: null,
    unit_type: null,
    unit_number: null,
    formatted_street_address: '15260 ANGUILLA ISLE AVE',
    city: 'TAMPA',
    state: 'FL',
    zip_code: '33647',
    zip_plus_four_code: '3723',
    carrier_code: 'R137',
    latitude: 28.134454,
    longitude: -82.291785,
    geocoding_accuracy: 'PARCEL CENTROID',
    census_tract: '120570102.101010',
  },
  metadata: {
    publishing_date: '2021-12-01',
  },
}

const uuid = '8558d955-7a0a-4538-b7b9-965202500f38'
jest.mock('@db/real-estate/realestate.db', () => ({
  fetchProperty: async () => data,
  createRealEstateData: async () => data,
}))

jest.mock('@utils/common.utils', () => ({
  getIdFromPKString: async () => uuid,
}))

/* jest.mock('../realEstate.service', () => ({
  createPropertyInfo: async () => '',
}))
 */
export class EmptyLogger implements LoggerService {
  log(_message: string): any {}
  error(_message: string, _trace: string): any {}
  warn(_message: string): any {}
  debug(_message: string): any {}
  verbose(_message: string): any {}
}
describe('realEstateService', () => {
  let realEstateService: RealEstateService
  // let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealEstateService],
    }).compile()

    // httpService = module.get<HttpService>(HttpService)
    realEstateService = module.get<RealEstateService>(RealEstateService)
  })

  it('should be defined', () => {
    expect(realEstateService).toBeDefined()
  })
  it('should return the data from dynamodb', async () => {
    let input = new FetchPropertyInput({
      city: 'Quam ratione voluptate soluta. Voluptatem assumenda qui voluptate labore',
      state: 'Consequuntur perferendis neque tempora quis nulla est ut reprehenderit.',
      zipCode: 47,
    })
    jest
      .spyOn(realEstateService, 'createPropertyInfo')
      .mockImplementation(() => Promise.resolve(data))
    const poolJobs = await realEstateService.createOrSearchProperty(input, null)
    data['re_id'] = uuid
    expect(poolJobs).toStrictEqual(data)
  })
})

// https://www.reddit.com/r/Nestjs_framework/comments/oa7yqz/tests_on_services/
