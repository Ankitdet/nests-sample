/// <reference path="../interfaces/zillow-digital/zillow-re.interface.ts"/>
import { StartsWith } from '@db/core/dyanamo-access-pattern'
import { Keys } from '@db/core/dynamo-enum'
import { Injectable } from '@nestjs/common'
import * as States from '@resources/states/states.json'
import { todayDate } from '@utils/index'
import { uuid } from 'uuidv4'
import { CompanyUrls, PlatformName } from '../enums'
import {
  DebtDigitalDBSchemaInf,
  DigitalArtworkInf,
  DigitalBondsInf,
} from '../interfaces'
@Injectable()
export class DataConverter {
  constructor() {
    // define constructor
  }

  public preparingCsvDataFromZillow = (address: any) => {
    return {
      csv: {
        tokenPrice: '',
        estROI: '',
        platFormFees: '',
        assetPrice: '',
        totalInverstment: '',
        city: address?.city,
        state: address?.state,
        zipCode: address?.zipcode,
        fullAddress: address?.streetAddress,
      },
    }
  }

  public csvMapping = (result: any, uniqueAttr: string, platform: string) => {
    const newArray = []
    const uniqueIds = []
    result.forEach(async (data: any) => {
      // For Realt platform
      if (platform === PlatformName.REALt) {
        this.realTCsvMapper(data, newArray, uniqueIds, uniqueAttr)
      } else if (platform === PlatformName.LoftY) {
        this.loftyCsvMapper(data, newArray, uniqueIds, uniqueAttr)
      } else if (platform === PlatformName['3Blocks']) {
        this.blocks3CsvMapper(data, newArray, uniqueIds, uniqueAttr)
      }
    })
    return { newArray, uniqueIds }
  }

  public zillowDbSchemaMapper(zillowResponse: any) {
    const zre: ZillowReNameSpace.ZillowDigital = zillowResponse
    const mapper: ZillowReNameSpace.ZillowDigital = {
      ...zre,
    }
    return mapper
  }

  public listDigitalReMapper = (_input: any) => {
    let loftState = ''
    // #Remove Later
    const arr = _input?.gsi1_sk?.split(' ') || _input?.gsi1_sk?.split(',') || []
    for (let i = arr.length - 1; i >= 0; i--) {
      loftState = States[String(arr[i]).toUpperCase()]?.value
      if (loftState) break
    }
    const state = loftState || _input?.csv?.state
    const url = CompanyUrls[_input?.companyName]

    // Making into number
    const totalTokens =
      Number(
        String(
          _input.blockchain?.totalTokens ||
            _input?.csv?.totalNumberOfTokens ||
            _input?.csv?.totalTokens,
        )
          .replace('$', '')
          .replace(/\,/g, ''),
      ) || 0
    const platFormFees =
      Number(
        String(_input.csv?.opExpenseReimburse || _input.csv?.platformListingFees)
          .replace('$', '')
          .replace(/\,/g, ''),
      ) || 0
    const assetPrice =
      Number(
        String(
          _input.csv?.underlyingAssetPrice ||
            _input.csv?.assestPrice ||
            _input.csv?.assetPrice,
        )
          .replace('$', '')
          .replace(/\,/g, ''),
      ) || 0

    const totalInverstment =
      Number(
        String(_input.csv?.totalInvestment || _input.csv?.totalInvestments)
          .replace('$', '')
          .replace(/\,/g, ''),
      ) || 0

    const estROI =
      Number(
        String(_input.csv?.expectedIncome || _input?.csv?.estROI).replace('%', ''),
      ) || 0
    const data: ListDigitalReNameSpace.ListData = {
      contractAddress: _input?.contractAddress || '',
      tokenPrice: _input?.csv?.tokenPrice || '',
      reId: _input?.reId,
      address: _input?.gsi1_sk,
      totalTokens,
      estROI,
      lastTradedPrice: _input.blockchain?.lastTradedPrice || '',
      platFormFees,
      assetPrice,
      totalInverstment,
      country: 'USA',
      state,
      zestimate: _input.zillow?.zestimateHistory || [],
      company: _input.companyName,
      url,
      rentPerToken: _input?.csv?.rentPerToken || '',
    }
    return data
  }

  public traditionalDataMapper = (input: any) => {
    if (input?.zillow?.data?.address) {
      const otherFacts = input?.zillow?.data?.resoFacts?.otherFacts
      const foundationType = otherFacts?.find((item: any) =>
        item.name?.includes('FOUNDATION'),
      )?.value
      const SEWER = otherFacts?.find((item: any) => item.name?.includes('SEWER'))?.value
      const water = otherFacts?.find((item: any) => item.name?.includes('WATER'))?.value
      return {
        basic: {
          propertyType:
            input?.zillow?.data?.resoFacts?.propertySubType?.[0] ||
            'Single Family Residence ',
          builtYear: input?.zillow?.data?.resoFacts?.yearBuilt || '2001',
          heating: input?.zillow?.data?.resoFacts?.heating?.[0] || 'Electric',
          cooling: input?.zillow?.data?.resoFacts?.cooling?.[0] || 'Central Air',
          parking: input?.zillow?.data?.resoFacts?.parking || 0 + ' Spaces',
          LotSize: input?.csv?.lotSize || input?.zillow?.data?.lotSize,
        },
        latitude: input?.zillow?.data?.latitude,
        longitude: input?.zillow?.data?.longitude,
        interiorDetails: {
          bedrooms: input?.zillow?.data?.bedrooms || 0,
          bathrooms: input?.zillow?.data?.bathrooms || 0,
          flooring: input?.zillow?.data?.resoFacts?.flooring?.[0] || 'Carpet',
          heatingFeatures: input?.zillow?.data?.resoFacts?.heating?.[0] || 'Electric',
          coolingFeatures:
            input?.zillow?.data?.resoFacts?.cooling?.[0] || 'Central Air',
        },
        propertyDetails: {
          livingArea: input?.zillow?.data?.livingArea,
          lotSize: input?.csv?.lotSize || input?.zillow?.data?.lotSize,
          stories: input?.zillow?.data?.resoFacts?.stories || 1,
          parking: input?.zillow?.data?.resoFacts?.parking || 0 + ' Spaces',
          parkingFeatures:
            input?.zillow?.data?.resoFacts?.parkingFeatures?.[0] || 'Carport',
          coveredSpaces: input?.zillow?.data?.resoFacts?.coveredSpaces || 0,
          carportSpaces: input?.zillow?.data?.resoFacts?.carportSpaces || 1,
        },
        constructionDetails: {
          constructionMaterials:
            input?.zillow?.data?.resoFacts?.constructionMaterials?.[0] || 'Black',
          foundation: foundationType,
          roof: input?.zillow?.data?.resoFacts?.roofType || 'shingle',
          constructionType: input?.zillow?.data?.resoFacts?.isNewConstruction
            ? 'New Construction'
            : 'Old Construction',
          yearBuilt: input?.zillow?.data?.resoFacts?.yearBuilt || 2004,
        },
        utilities: {
          sewerInfo: SEWER,
          waterInfo: water || 'Public',
          UtilitiesForProperty: 'Public',
        },
        about: input?.zillow?.data?.description,
      }
    }
    return {}
  }

  public readonly debtDataMapper = (input: DebtDigitalDBSchemaInf) => {
    if (
      input?.assetName?.includes('Multi-family') ||
      input?.assetName?.includes('Real Estate') ||
      input?.companyName?.includes('Cytus Finance')
    ) {
      input.type = 'Real Estate'
    } else if (
      input?.assetName?.includes('Bond') ||
      input?.assetName?.includes('Treasury')
    ) {
      input.type = 'Bond'
    }
    const blck = 'Ethereum'

    const debtSize: any =
      Number(
        String(input.debt?.debtSize || input?.totalAssets)
          .replace('$', '')
          .replace(/\,/g, '') || '',
      ) || 0
    const resp: any = {
      companyName: input?.companyName,
      debtId: input?.debtId,
      debtName: input.debt?.debtName || input?.assetName,
      debtSize,
      debtTenure: input.debt?.debtTenure || '',
      debtType: input.debt?.debtType || input.type,
      endDate: input.debt?.endDate || '',
      startDate: input.debt?.startDate || '',
      estRoi:
        Number((input.debt?.estRoi || input?.estYieldToMaturity)?.replace('%', '')) ||
        0,
      status: input.debt?.status || '',
      url: input?.url || CompanyUrls[input?.companyName],
      tokenName: input?.tokenName || '',
      smartContract: input?.smartContract || '',
      factSheet: input?.factSheet || '',
      blockchain: input.blockchain || blck,
      fundMgmtFees: input?.fundMgmtFees || '',
      additionalFees: input?.additionalFees || '',
      liquidity: input?.liquidity || '',
    }
    return resp
  }

  public readonly bondsDataMapper = (input: any) => {
    const truncateStr = (str: string) => str?.replace(/ of daily trading volume$/, '')
    const resp: DigitalBondsInf = {
      companyName: input?.companyName,
      additionalFees: input?.bond?.additionalFees,
      assetName: input?.bond?.assetName,
      day30SecYield: input?.bond?.day30SecYield,
      estYieldToMaturity: input?.bond?.estYieldToMaturity,
      factSheet: input?.bond?.factSheet,
      fundMgmtFees: input?.bond?.fundMgmtFees,
      liquidity: truncateStr(input?.bond?.liquidity),
      productPage: input?.bond?.productPage,
      smartContract: input?.bond?.smartContract,
      standardDeviation: input?.bond?.standardDeviation,
      tokenName: input?.bond?.tokenName,
      totalAssets: input?.bond?.totalAssets,
      blockchain: input?.blockchain,
      type: input?.type,
      weightedAvgMaturity: input?.bond?.weightedAvgMaturity,
    }
    return resp
  }

  public readonly artsDataMapper = (input: any) => {
    const resp: DigitalArtworkInf = {
      companyName: input.companyName,
      artist: input.arts?.artist,
      artName: input.arts?.artName,
      blockchain: input.arts?.blockchain,
      pricePerShare: input.arts?.pricePerShare,
      smartContract: input.arts?.smartContract,
      url: input.url,
    }
    return resp
  }

  private readonly blocks3CsvMapper = (
    data: any,
    newArray: any,
    uniqueIds: any,
    uniqueAttr: string,
  ) => {
    const reId = uuid()
    const contractAddress = '0x6aa43165f4664a5e7c69678a9865e280162cf31f'
    newArray.push({
      PutRequest: {
        Item: {
          [Keys.PK]: StartsWith.DIGITAL_RE + reId,
          [Keys.SK]: PlatformName['3Blocks'],
          [Keys.GSI1_PK]: StartsWith.DIGITAL_RE,
          [Keys.GSI1_SK]: data[`${uniqueAttr}`],
          companyName: PlatformName['3Blocks'],
          reId,
          contractAddress,
          created_at: todayDate,
          csv: {
            tokenPrice: data.tokenPrice || '',
            estROI: data.expectedNetRoi || '',
            platFormFees: data.platformFees || '',
            assetPrice: data.assetPrice || '',
            totalInverstment: data.totalInvestments || '',
            fullAddress: data.addressStreetAddress,
            ...data,
          },
        },
      },
    })
    // we'll get for future use, (update operation.)
    uniqueIds.push({
      [Keys.PK]: StartsWith.DIGITAL_RE + reId,
      [Keys.SK]: PlatformName['3Blocks'],
      address: data[`${uniqueAttr}`],
      contractAddress,
      reId,
      blocks: { ...data },
    })
  }
  private readonly realTCsvMapper = (
    data: any,
    newArray: any,
    uniqueIds: any,
    uniqueAttr: string,
  ) => {
    const reId = uuid()
    const contractAddress = data?.contactAddress?.match(/0x[a-fA-F0-9]{40}/)?.[0]
    /*
    pk : #DRE#<id>
    sk : contractAddress
    gsi1_pk : #DRE#
    gsi1_sk : identifier 
    */
    newArray.push({
      PutRequest: {
        Item: {
          [Keys.PK]: StartsWith.DIGITAL_RE + reId,
          [Keys.SK]: PlatformName.REALt,
          [Keys.GSI1_PK]: StartsWith.DIGITAL_RE,
          [Keys.GSI1_SK]: data[`${uniqueAttr}`],
          companyName: PlatformName.REALt,
          reId,
          created_at: todayDate,
          contractAddress,
          csv: data,
        },
      },
    })
    // we'll get for future use, (update operation.)
    uniqueIds.push({
      [Keys.PK]: StartsWith.DIGITAL_RE + reId,
      [Keys.SK]: PlatformName.REALt,
      address: data[`${uniqueAttr}`],
      contractAddress,
      reId,
    })
  }

  private readonly getLoftyCity = (uniqueData: string) => {
    const arr = uniqueData?.split(' ')
    let loftCity = ''
    for (const w of arr) {
      loftCity = States[String(w).toUpperCase()]?.value
      if (loftCity) break
    }
    if (loftCity === '') {
      const d = String(uniqueData).toUpperCase()
      if (d.includes('NEW HAMPSHIRE')) {
        loftCity = 'New Hampshire'
      } else if (d.includes('NEW JERSEY')) {
        loftCity = 'New Jersey'
      } else if (d.includes('NEW YORK')) {
        loftCity = 'New York'
      } else if (d.includes('NORTH CAROLINA')) {
        loftCity = 'North Carolina'
      } else if (d.includes('NORTH DAKOTA')) {
        loftCity = 'North Dakota'
      } else if (d.includes('RHODE ISLAND')) {
        loftCity = 'Rhode Island'
      } else if (d.includes('SOUTH CAROLINA')) {
        loftCity = 'South Carolina'
      } else if (d.includes('SOUTH DAKOTA')) {
        loftCity = 'South Dakota'
      } else if (d.includes('WEST VIRGINIA')) {
        loftCity = 'West Virginia'
      }
    }
    return loftCity
  }

  private readonly loftyCsvMapper = (
    data: any,
    newArray: any,
    uniqueIds: any,
    uniqueAttr: string,
  ) => {
    const reId = uuid()
    const contractAddress = data?.contactAddress?.match(/0x[a-fA-F0-9]{40}/)?.[0] || ''
    const uniqueData = data[`${uniqueAttr}`].replace(/  +/g, ' ')
    const loftCity = this.getLoftyCity(uniqueData)
    newArray.push({
      PutRequest: {
        Item: {
          [Keys.PK]: StartsWith.DIGITAL_RE + reId,
          [Keys.SK]: PlatformName.LoftY,
          [Keys.GSI1_PK]: StartsWith.DIGITAL_RE,
          [Keys.GSI1_SK]: uniqueData,
          companyName: PlatformName.LoftY,
          reId,
          created_at: todayDate,
          contractAddress,
          csv: { ...data, city: loftCity },
        },
      },
    })
    // we'll get for future use, (update operation.)
    uniqueIds.push({
      [Keys.PK]: StartsWith.DIGITAL_RE + reId,
      [Keys.SK]: PlatformName.LoftY,
      address: uniqueData,
      contractAddress,
      reId,
    })
  }
}
