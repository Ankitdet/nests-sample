/// <reference path="../../core/interfaces/zillow-digital/zillow-re.interface.ts"/>

import { ESTATE_BASE_URL, ESTATE_TOKEN } from '@const/environments'
import { FetchPropertyInput, RealEstateArgs } from '@core/args'
import { RealEstateListingInput } from '@core/inputs'
import {
  INoPropertFound,
  IRealEstateListing,
  RealEstateInterface,
  RealEstateSmartContract,
  Structure,
} from '@core/interfaces'
import { RealEstateSchema } from '@core/schemas/real-estate/real-estate.schema'
import { Keys } from '@db/core/dynamo-enum'
import {
  createRealEstateFinanceData,
  RealEstateFinance,
} from '@db/real-estate-finance/real-estate-finance.db'
import {
  createCumulatives,
  CumulativeDB,
  getCumulatives,
  updateCumulatives,
} from '@db/real-estate/cumulative.db'
import {
  createRealEstateData,
  fetchProperty,
  getRealEstateBasicInfoById,
  getRealEstateFinanceByReId,
  getRealEstateInfoList,
  getRealEstateInfoListWithoutIds,
  PropertyInfoDynamo,
  updateSmartContractDB,
} from '@db/real-estate/real-estate.db'
import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { BaseHttpService } from '@shared/base.http.service'
import { logger } from '@shared/logger/logger'
import { getIdFromString, validaAndFormatDateString } from '@utils/common.utils'
import { tokonomicsEnginee } from '@utils/real-estate/tokonomics.util'
import { Request } from 'express'
import _ from 'lodash'
import { isRealEstateBasicDataFound } from '../../utils/real-estate/real-estate-common.util'

@Injectable({ scope: Scope.REQUEST })
export class RealEstateService extends BaseHttpService {
  constructor(
    protected httpService: HttpService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(httpService)
  }

  async createPropertyFinance(
    realEstateInput: RealEstateArgs,
  ): Promise<RealEstateInterface> {
    logger.info('real-estate createPropertyFinance called.')
    await isRealEstateBasicDataFound(realEstateInput.re_id)
    // tokonomics enginee
    const tokonomicsEngineeValues = await tokonomicsEnginee(realEstateInput)

    const realEstateFinance = new RealEstateFinance({
      ...tokonomicsEngineeValues,
      re_id: realEstateInput.re_id,
    })
    const response = await createRealEstateFinanceData(realEstateFinance)
    const responseData = {
      re_id: getIdFromString(response, Keys.PK),
      ...response,
    } as RealEstateInterface
    return responseData
  }

  async createOrSearchProperty(
    input: FetchPropertyInput,
    user: any,
  ): Promise<IRealEstateListing | INoPropertFound> {
    logger.info('real-estate service called.')

    // let propertyDataFromEstated = null
    const propertyData = await fetchProperty(
      input?.streetAddress?.toUpperCase(),
      input?.city?.toUpperCase(),
      input?.state?.toUpperCase(),
      input?.zipCode,
    )

    if (!_.isEmpty(propertyData)) {
      return {
        ...propertyData,
        re_id: getIdFromString(propertyData, Keys.PK),
        user_id: getIdFromString(propertyData, Keys.GSI1_PK),
      }
    }

    let query = `${ESTATE_BASE_URL}?token=${ESTATE_TOKEN}`

    if (input.streetAddress) {
      query += `&street_address=${input.streetAddress}`
    }
    if (input.city) {
      query += `&city=${input.city}`
    }
    if (input.state) {
      query += `&state=${input.state}`
    }
    if (input.zipCode) {
      query += `&zip_code=${input.zipCode}`
    }
    const propertyDataFromEstated = await super.httpGet(query)
    if (!propertyDataFromEstated.data) {
      return {
        message: 'No data found, please enter data manually',
      }
    }

    const data = propertyDataFromEstated.data
    const userId = user?.['sub']
    const reNewData: IRealEstateListing = await this.createPropertyInfo(data, userId)
    await this.cumulative(data?.structure)

    // we has store the re_id as pk
    reNewData.re_id = getIdFromString(reNewData, Keys.PK)
    return reNewData
  }

  async createRealEstateBasicInfo(
    input: RealEstateListingInput,
  ): Promise<IRealEstateListing> {
    const data: IRealEstateListing = {
      address: input.address,
      assessments: input.assessments,
      deeds: input.deeds,
      market_assessments: input.market_assessments,
      metadata: input.metadata,
      owner: input.owner,
      parcel: input.parcel,
      structure: input.structure,
      taxes: input.taxes,
      valuation: input.valuation,
      youtubeLink: input.youtubeLink,
      metaLink: input.metaLink,
      metaLandRevenueStream: input.metaLandRevenueStream,
    }
    const reNewData: IRealEstateListing = await this.createPropertyInfo(
      data,
      input.user_id,
    )

    const { structure } = data
    await this.cumulative(structure)
    reNewData.re_id = getIdFromString(reNewData, Keys.PK)
    return reNewData
  }
  public async createPropertyInfo(data: any, userId?: string): Promise<any> {
    let realEstateInfo: RealEstateSchema
    realEstateInfo = this.setObject(
      userId,
      {
        metadata: data?.metadata,
        address: data?.address,
        parcel: data?.parcel,
        boundary: data?.boundary,
        structure: data?.structure,
        valuation: data?.valuation,
        taxes: data?.taxes,
        assessments: data?.assessments,
        market_assessments: data?.market_assessments,
        owner: data?.owner,
        deeds: data?.deeds,
      },
      data.youtubeLink,
      data.metaLink,
      data.metaLandRevenueStream,
    )
    const realEstateObject = new PropertyInfoDynamo(realEstateInfo)
    return await createRealEstateData(realEstateObject)
  }

  public async getRealEstateFinanceByReId(re_id: string): Promise<RealEstateInterface> {
    logger.info('calling getRealEstateFinanceByReId')
    const reData = await getRealEstateFinanceByReId(re_id, this.request)
    return {
      re_id: getIdFromString(reData, Keys.PK),
      user_id: getIdFromString(reData, Keys.GSI1_PK),
      ...(reData as RealEstateInterface),
    }
  }

  public async cumulative(structure: Structure): Promise<void> {
    // step 1 : get cumulatives from get query (existing)
    // step 2 : if no then create new
    // step 3 : if yes then update with new upcomming data.
    const cumulatives = await getCumulatives({})

    // yes
    if (cumulatives) {
      cumulatives.cumulative_baths =
        cumulatives.cumulative_baths + structure?.baths || 0
      cumulatives.cumulative_beds =
        cumulatives.cumulative_beds + structure?.beds_count || 0

      await updateCumulatives({
        cumulative_baths: cumulatives.cumulative_baths,
        cumulative_beds: cumulatives.cumulative_beds,
      })
    } /* no */ else {
      const cDb = new CumulativeDB({
        cumulative_baths: structure?.baths || 0,
        cumulative_beds: structure?.beds_count || 0,
      })
      await createCumulatives(cDb)
    }
  }

  public async updateSmartContract(
    reId: string,
    tokenId: string,
    tokenSmartContractUrl: string,
    propertyDescription: string,
    additionalPerks: string,
    companyName: string,
    closingDate: string,
    offeringMemorandumDate: string,
  ): Promise<RealEstateSmartContract> {
    const prop = new PropertyInfoDynamo({
      re_id: reId,
      token_id: tokenId,
      token_smart_contract_url: tokenSmartContractUrl,
      property_description: propertyDescription,
      additional_perks: additionalPerks,
      company_name: companyName,
      closing_date: validaAndFormatDateString(closingDate),
      offering_memorandum_date: validaAndFormatDateString(offeringMemorandumDate),
    })
    const resp: RealEstateSmartContract = await updateSmartContractDB(prop)
    logger.info('update SmartContract:', resp)
    return resp
  }

  public getRealEstateBasicInfoById = async (re_id: string): Promise<any> => {
    const propInfo = new PropertyInfoDynamo({
      re_id,
    })
    return await getRealEstateBasicInfoById(propInfo)
  }

  async getRealEstateInfoList(reIds: [string]): Promise<any> {
    return await getRealEstateInfoList(reIds)
  }

  async getRealEstateInfoListWithoutIds(): Promise<any> {
    return await getRealEstateInfoListWithoutIds()
  }
  /* 
  async getRealEstateInfoListWithoutIds(query: Paginated): Promise<any> {
    return await getRealEstateInfoListWithoutIds(query)
  }
 */
  private setObject(
    user_id: string,
    {
      metadata,
      address,
      parcel,
      boundary,
      structure,
      taxes,
      assessments,
      valuation,
      owner,
      deeds,
      market_assessments,
    },
    youtubeLink?: string,
    metaLink?: string,
    metaLandRevenueStream?: string,
    company_name?: string,
    closing_date?: string,
    offering_memorandum_date?: string,
  ): RealEstateSchema {
    const realestateDb = {} as RealEstateSchema
    realestateDb.metadata = metadata
    // this.address = address
    realestateDb.company_name = company_name
    realestateDb.closing_date = closing_date
    realestateDb.offering_memorandum_date = offering_memorandum_date
    realestateDb.address_street_number = address?.street_number
    realestateDb.address_street_pre_direction = address?.street_pre_direction
    realestateDb.address_street_name = address?.street_name
    realestateDb.address_street_suffix = address?.street_suffix
    realestateDb.address_street_post_direction = address?.street_post_direction
    realestateDb.address_unit_type = address?.unit_type
    realestateDb.address_unit_number = address?.unit_number
    realestateDb.address_streetAddress = address?.streetAddress
    realestateDb.address_city = address?.city
    realestateDb.address_state = address?.state
    realestateDb.address_zipCode = address?.zipCode
    realestateDb.address_zip_plus_four_code = address?.zip_plus_four_code
    realestateDb.address_carrier_code = address?.carrier_code
    realestateDb.address_latitude = address?.latitude
    realestateDb.address_longitude = address?.longitude
    realestateDb.address_geocoding_accuracy = address?.geocoding_accuracy
    realestateDb.address_census_tract = address?.census_tract

    /* realestateDb.parcel = parcel */
    realestateDb.parcel_apn_original = parcel?.apn_original
    realestateDb.parcel_apn_unformatted = parcel?.apn_unformatted
    realestateDb.parcel_apn_previous = parcel?.apn_previous
    realestateDb.parcel_fips_code = parcel?.fips_code
    realestateDb.parcel_frontage_ft = Number(parcel?.frontage_ft) || -1
    realestateDb.parcel_depth_ft = Number(parcel?.depth_ft) || -1
    realestateDb.parcel_area_sq_ft = Number(parcel?.area_sq_ft) || -1
    realestateDb.parcel_area_acres = Number(parcel?.area_acres) || -1
    realestateDb.parcel_county_name = parcel?.county_name
    realestateDb.parcel_county_land_use_code = parcel?.county_land_use_code
    realestateDb.parcel_county_land_use_description =
      parcel?.county_land_use_description
    realestateDb.parcel_standardized_land_use_category =
      parcel?.standardized_land_use_category
    realestateDb.parcel_standardized_land_use_type = parcel?.standardized_land_use_type
    realestateDb.parcel_location_descriptions = parcel?.location_descriptions
    realestateDb.parcel_zoning = parcel?.zoning
    realestateDb.parcel_building_count = parcel?.building_count
    realestateDb.parcel_tax_account_number = parcel?.tax_account_number
    realestateDb.parcel_legal_description = parcel?.legal_description
    realestateDb.parcel_lot_code = parcel?.lot_code
    realestateDb.parcel_lot_number = parcel?.lot_number
    realestateDb.parcel_subdivision = parcel?.subdivision
    realestateDb.parcel_municipality = parcel?.municipality
    realestateDb.parcel_section_township_range = parcel?.section_township_range

    realestateDb.boundary_wkt = boundary?.wkt
    realestateDb.boundary_geojson = boundary?.geojson
    // realestateDb.structure = structure
    realestateDb.structure_year_built = Number(structure?.year_built) || -1
    realestateDb.structure_effective_year_built =
      Number(structure?.effective_year_built) || -1
    realestateDb.structure_stories = structure?.stories
    realestateDb.structure_rooms_count = structure?.rooms_count
    realestateDb.structure_beds_count = Number(structure?.beds_count) || -1
    realestateDb.structure_baths = Number(structure?.baths) || -1
    realestateDb.structure_partial_baths_count = structure?.parking_spaces_count
    realestateDb.structure_units_count = Number(structure?.units_count) || -1
    realestateDb.structure_parking_type = structure?.parking_type
    realestateDb.structure_parking_spaces_count =
      Number(structure?.parking_spaces_count) || -1
    realestateDb.structure_pool_type = structure?.pool_type
    realestateDb.structure_architecture_type = structure?.architecture_type
    realestateDb.structure_construction_type = structure?.construction_type
    realestateDb.structure_exterior_wall_type = structure?.exterior_wall_type
    realestateDb.structure_foundation_type = structure?.foundation_type
    realestateDb.structure_roof_material_type = structure?.roof_material_type
    realestateDb.structure_roof_style_type = structure?.roof_style_type
    realestateDb.structure_heating_type = structure?.heating_type
    realestateDb.structure_heating_fuel_type = structure?.heating_fuel_type
    realestateDb.structure_air_conditioning_type = structure?.air_conditioning_type
    realestateDb.structure_fireplaces = structure?.fireplaces
    realestateDb.structure_basement_type = structure?.basement_type
    realestateDb.structure_quality = structure?.quality
    realestateDb.structure_condition = structure?.condition
    realestateDb.structure_flooring_types = structure?.flooring_types
    realestateDb.structure_plumbing_fixtures_count = structure?.plumbing_fixtures_count
    realestateDb.structure_interior_wall_type = structure?.interior_wall_type
    realestateDb.structure_water_type = structure?.water_type
    realestateDb.structure_sewer_type = structure?.sewer_type
    realestateDb.structure_total_area_sq_ft = Number(structure?.total_area_sq_ft) || -1
    realestateDb.structure_other_areas = structure?.other_areas
    realestateDb.structure_other_rooms = structure?.other_rooms
    realestateDb.structure_other_features = structure?.other_features
    realestateDb.structure_other_improvements = structure?.other_improvements
    realestateDb.structure_amenities = structure?.amenities
    // realestateDb.valuation = valuation
    realestateDb.valuation_date = valuation?.date
    realestateDb.valuation_forecast_standard_deviation =
      Number(valuation?.forecast_standard_deviation) || -1
    realestateDb.valuation_high = Number(valuation?.high) || -1
    realestateDb.valuation_low = Number(valuation?.low) || -1
    realestateDb.valuation_value = Number(valuation?.value) || -1

    realestateDb.taxes = taxes
    realestateDb.assessments = assessments
    realestateDb.market_assessments = market_assessments
    // realestateDb.owner = owner

    realestateDb.owner_name = owner?.name
    realestateDb.owner_second_name = owner?.second_name
    realestateDb.owner_unit_type = owner?.unit_number
    realestateDb.owner_unit_number = owner?.unit_number
    realestateDb.owner_formatted_street_address = owner?.formatted_street_address
    realestateDb.owner_city = owner?.city
    realestateDb.owner_state = owner?.state
    realestateDb.owner_zip_code = owner?.zip_code
    realestateDb.owner_zip_plus_four_code = owner?.zip_plus_four_code
    realestateDb.owner_occupied = owner?.owner_occupied

    realestateDb.deeds = deeds

    // other fields
    realestateDb.userId = user_id
    realestateDb.add = address?.formatted_street_address || address?.streetAddress
    realestateDb.city = address?.city
    realestateDb.state = address?.state
    realestateDb.zip = address?.zip_code || address?.zipCode
    realestateDb.meta_link = metaLink
    realestateDb.youtube_link = youtubeLink
    realestateDb.meta_land_revenue_stream = metaLandRevenueStream
    return realestateDb
  }
}
