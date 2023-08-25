/// <reference path="../../core/interfaces/zillow-digital/zillow-re.interface.ts"/>
import {
  DIGITAL_RE_BUCKET,
  GNOSIS_API_KEY,
  NODE_ENV,
  SNOWTRACE_API_KEY,
  STAGE,
} from '@const/environments'
import { DataConverter } from '@core/converters/zillow.converter'
import { Environments, PlatformName, QueryString } from '@core/enums'
import { CompanyInput } from '@core/object-types/zillow-digital/zillow-digital.type'
import { StartsWith } from '@db/core/dyanamo-access-pattern'
import { Keys } from '@db/core/dynamo-enum'
import { getDigitalDebtDB, listDigitalDebt } from '@db/index'
import {
  createDataIntoDigitalBonds,
  createDataIntoDigitalDebt,
  createDataIntoDigitalRe,
  createDigitalArts,
  createExportedDataIntoDigitalRe,
  createReCompanySocialsDB,
  getDigitalRealEstateDB,
  getDigitalReCompanyDB,
  getExistingReData,
  getMarketCapitalisationDB,
  listDigitalArts,
  listDigitalBondsDB,
  listDigitalReDB,
  listDigitalReOnlyPK,
  queryDataByAddress,
  queryDigitalReByCompanyName,
  updateBlockchainData,
  updateExistingDigitalREDb,
  updateMarketCapitalisationDB,
} from '@db/zillow-digital/zillow-digital.db'
import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable, Scope } from '@nestjs/common'
import { axiosGet, BaseHttpService } from '@shared/base.http.service'
import { BaseError } from '@shared/errors'
import { ErrorHandleAndThrow, ErrorHandler } from '@shared/errors/axios-errors'
import { logger } from '@shared/logger/logger'
import { IsValid, sleep } from '@utils/common.utils'
import {
  camelizeKeys,
  deleteFile,
  extractUUIDFromString,
  getAllKeysByPrefix,
  getRePlatform,
  getUniqueAttrByPlatform,
  getWebpImageById,
  readDataFromFile,
  readDataFromS3,
} from '@utils/index'
import {
  photos,
  zestimateHistory,
  zillowSearch,
} from '@utils/zillowDigital/zillow-rapid.utils'
import BigNumber from 'bignumber.js'
import _, { isNumber } from 'lodash'
import { performance } from 'perf_hooks'
import { uuid } from 'uuidv4'
import { DigitalArtworkInf, DigitalBondsInf } from '../../core/interfaces'
import { downloadAttachment, listWebscrappingS3 } from '../s3-buckets/s3utils'

@Injectable({ scope: Scope.REQUEST })
export class ZilloDigitalService extends BaseHttpService {
  constructor(
    protected httpService: HttpService,
    protected readonly dataConverter: DataConverter,
  ) {
    super(httpService)
  }

  public async getDigitalReDataByAddressService(address: string): Promise<any> {
    const zillowResponse = await zillowSearch(address)
    logger.info(`Zillow Response ${JSON.stringify(zillowResponse)}`)

    if (!IsValid(zillowResponse) || zillowResponse?.['error']) {
      logger.error({ error: JSON.stringify(zillowResponse) })
      return {}
    }

    if (zillowResponse?.status === HttpStatus.TOO_MANY_REQUESTS) {
      logger.error(`Too many Request, try another time. ${address}`)
      return HttpStatus.TOO_MANY_REQUESTS
    }

    if (zillowResponse && Array.isArray(zillowResponse)) {
      throw new BaseError(
        HttpStatus.BAD_REQUEST,
        'Input address is not exact, we are getting multiple address, please send exact address.',
      )
    }

    if (zillowResponse?.error) {
      logger.error(zillowResponse?.error)
      return {}
    }

    return this.dataConverter.zillowDbSchemaMapper(zillowResponse)
  }

  public async syncingAllServices(keys: any) {
    const t0 = performance.now()
    if (STAGE === Environments.LOCAL || NODE_ENV === Environments.LOCAL) {
      keys = [
        {
          Key: '/Users/apdetroja/assume-role-repo/tools-account/ccr-3blk-tools-uea1-3blocks-core-vesta/src/modules/zillow-digital/3blocks-results-6.csv',
        },
      ]
    }
    for await (const item of keys) {
      const fileToProcess = item?.['Key']
      const platform = getRePlatform(fileToProcess)
      if (!platform) {
        logger.warn(`Skip this file : ${fileToProcess}`)
        continue
      }
      logger.info(`Reading data from s3 using key: ${fileToProcess}`)
      let csvResultData = null
      if (STAGE === Environments.LOCAL || NODE_ENV === Environments.LOCAL) {
        csvResultData = await readDataFromFile(fileToProcess)
      } else {
        csvResultData = await readDataFromS3(fileToProcess)
      }

      // Get unique attribute based on platforms.
      const uniquAttrbuteToCompare = getUniqueAttrByPlatform(platform)
      logger.info(`CSV records found : ${JSON.stringify(csvResultData)}`)

      // Remove duplicate Row from CSV.
      let uniqueArr = csvResultData?.filter(
        (obj, index, self) =>
          index ===
          self.findIndex(
            o => o[`${uniquAttrbuteToCompare}`] === obj[`${uniquAttrbuteToCompare}`],
          ),
      )
      // Camelcase all the properties of json which get from S3 bucket.
      const csvObj = camelizeKeys(uniqueArr)
      logger.info(`Unique records found in CSV : ${csvObj.length}`)

      // Get all the existing data from digital re table data. (1000 data)
      const existingReData = await getExistingReData()
      logger.info(`Existing records found from DB : ${existingReData.length}`)

      // Sleep for 0.5 sec
      await sleep(500)

      // compare csvobject result with DB result.
      const c = new Set(
        existingReData.map((obj: any) =>
          obj?.csv?.[`${uniquAttrbuteToCompare}`]?.trim(),
        ),
      )
      const result = csvObj.filter(
        (obj: any) => !c.has(obj?.[`${uniquAttrbuteToCompare}`]?.trim()),
      )
      logger.info(`Records will be inserted : ${result.length}`)

      if (result.length > 0) {
        // Iterate on result and make the PK, SK, GSI1_PK, GSI1_SK
        let { newArray, uniqueIds } = this.dataConverter.csvMapping(
          result,
          uniquAttrbuteToCompare,
          platform,
        )
        // create in DB, BatchWrite operation
        try {
          await createDataIntoDigitalRe(newArray)
          logger.info(`Successfully Inserted data for Key : ${fileToProcess} .`)
        } catch (e) {
          // If you can't success Batch Create operation then uniqueIds, uniqueArr is no more used.
          newArray = []
          uniqueIds = []
          uniqueArr = []
          logger.error(
            `Error while createDataIntoDigitalRe operations ${JSON.stringify(e)}`,
          )
        }

        // Sleep for 1 sec
        await sleep(1000)

        // Update on existing records.
        await this.updateDigitalReDataToDB(
          uniqueIds,
          uniqueArr,
          platform,
          fileToProcess,
        )
      } else {
        logger.info(`Records founds : ${result.length} for ${fileToProcess}`)
        logger.info(`Go for another file to process`)
      }
      const t1 = performance.now()
      logger.info(`Execution took ${t1 - t0}ms to execute.`)
    }
  }

  // Individual APIs to syncZillow Data
  public async syncingZillow(addresses: any) {
    /*   const reIds1 = [
        { pk: '', sk: '', fullAddress: '' },
        { pk: '', sk: '', fullAddress: '' }
      ] */
    let finalData = {}
    for await (const reId of addresses) {
      const id = extractUUIDFromString(reId?.pk)
      const zillow = await this.preparingZillowData(reId.fullAddress, id)

      if (isNumber(zillow) && zillow === 429) {
        finalData = {
          zillow: { data: 'Too many requests', zestimateHistory: [] },
        }
      } else if (IsValid(zillow)) {
        logger.info(`Calling zestimate API, zpid: ${zillow?.zpid} `)
        this.deleteZillowProperties(zillow)
        const zestimateApi: any =
          (await zestimateHistory(zillow?.zpid?.toString())) || []
        let latestValue = {}
        if (Array.isArray(zestimateApi?.data)) {
          latestValue = zestimateApi?.data[zestimateApi?.data?.length - 1] || {}
        }
        finalData = {
          zillow: { data: zillow, zestimateHistory: latestValue },
        }
      } else {
        finalData = {
          zillow: { data: 'Not Available', zestimateHistory: [] },
        }
      }
      await updateExistingDigitalREDb({ ...finalData }, { pk: reId?.pk, sk: reId?.sk })
    }
    logger.info('Update done Zillow.')
    return finalData
  }
  // Individual APIs to syncBlockChain Data
  public async syncingBlockChain(platform: string, key?: string) {
    if (platform === PlatformName.LoftY) {
      await this.syncLoftyBlchainData()
    } else if (platform === PlatformName.REALt) {
      await this.syncRealtBlchainData(key)
    } else if (platform === PlatformName.RoofStock) {
      await this.syncRoofStockBlchainData(key, PlatformName.RoofStock)
    } else if (platform === PlatformName.Akru) {
      await this.syncAkrukBlchainData(key, PlatformName.Akru)
    } else {
      logger.info(`Not executing csv platform : ${platform}, key: ${key}`)
    }
    logger.info('Blockchain update completed...')
  }

  public async getChartDataByAddressService(address: string, days: string) {
    let chartPrices = []
    try {
      const { prices } = await axiosGet(
        `https://api.coingecko.com/api/v3/coins/${address}/market_chart?vs_currency=usd&days=${days}`,
      )
      chartPrices = prices
    } catch (e) {
      logger.error({ error: `Error while getting the api data ${JSON.stringify(e)}}` })
      throw e
    }
    return { prices: chartPrices }
  }

  public async listDigitalReService(): Promise<any> {
    // TODO Pending here.
    const zillowReData = await listDigitalReDB()
    // zillowReData = zillowReData?.filter((f: any) => f.companyName === 'realt')
    const data: [ListDigitalReNameSpace.ListData] = zillowReData?.map((z: any) => {
      return this.dataConverter.listDigitalReMapper(z)
    })
    return { res: data }
  }
  public async createReCompanySocialsService(input: CompanyInput) {
    try {
      return await createReCompanySocialsDB(input)
    } catch (e) {
      logger.error({
        error: `Error while creating reCompany socials in Db ${JSON.stringify(e)}`,
      })
      throw e
    }
  }
  public async getDigitalReCompanyService(companyName: string) {
    return await getDigitalReCompanyDB(companyName)
  }

  public async listContractAddrByCompanyService(
    realTDeployer: string,
    functionName: string,
  ) {
    try {
      const endpoint = `https://api.gnosisscan.io/api?module=account&action=txlist&address=${realTDeployer} &startblock=0&endblock=99999999&offset=10&sort=asc&apikey=${GNOSIS_API_KEY}`
      const response = await axiosGet(endpoint)
      const transactions = response?.result
      const filteredTransactions = transactions
        ?.filter(({ input }) => input.slice(0, 10) === functionName)
        ?.map(({ contractAddress }) => ({ contractAddr: contractAddress }))
      return filteredTransactions
    } catch (e) {
      ErrorHandleAndThrow(e, 'Error while getting the contract address from blockchain')
    }
  }

  public getDigitalRealEstateService = async (reId: string, companyName: string) => {
    return await getDigitalRealEstateDB(reId, companyName)
  }

  public async updateMarketCapitalisation() {
    const resp = await listDigitalReDB()
    let marketCapitalisation = new BigNumber(0)
    resp?.forEach(async (e: any) => {
      const assetPrice =
        e?.csv?.underlyingAssetPrice || e?.csv?.assestPrice || e?.csv?.assetPrice
      if (assetPrice) {
        const splitedData = assetPrice?.split('.')[0]
        const newNumb = new BigNumber(splitedData?.replace(/\D/g, ''))
        marketCapitalisation = new BigNumber(
          marketCapitalisation.plus(newNumb).toNumber(),
        )
      }
    })
    updateMarketCapitalisationDB({
      marketCapitalisation: marketCapitalisation.toNumber(),
    })
    return {
      key: resp.key || {},
    }
  }

  public async getMarketCapitalisation() {
    const fmt = {
      prefix: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0,
      suffix: '',
    }
    BigNumber.config({ FORMAT: fmt })
    const lastEvalutateObj = await getMarketCapitalisationDB()
    const mc = new BigNumber(lastEvalutateObj?.marketCapitalisation || 0)
    return '$' + mc.toFormat()
  }

  public createRealTHistoricalDataServ = async () => {
    const topic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    try {
      // const reData = response.map(({ pk, sk, contractAddress }) => ({
      //   pk,
      //   sk,
      //   contractAddress,
      // }))

      const reData = await queryDigitalReByCompanyName(PlatformName.REALt)

      reData?.forEach(async ({ pk, sk, contractAddress }) => {
        let blockChainData = []
        if (contractAddress.length > 0) {
          blockChainData = await this.getDatabyLogsBy(contractAddress, topic)
        }

        const latestBlockchainData = blockChainData.slice(-20)
        await updateExistingDigitalREDb(
          {
            historicalData: latestBlockchainData,
          },
          { pk, sk },
        )
      })
      logger.info('historical data updated')
      return 'done'
    } catch (e) {
      ErrorHandleAndThrow(
        e,
        'Error while updating the historical data in DB from blockchain',
      )
    }
  }

  public readonly getTraditionalInfo = async (reId: string, companyName: string) => {
    try {
      const digitalReObj = await getDigitalRealEstateDB(reId, companyName)
      const mappedData = this.dataConverter.traditionalDataMapper(digitalReObj)
      if (_.isEmpty(mappedData)) {
        return {}
      }
      const images = await getWebpImageById(reId)
      const newObj = {
        reId,
        companyName,
        images,
        ...mappedData,
      }
      return newObj
    } catch (e) {
      ErrorHandleAndThrow(e, 'Error while getting the traditional info')
    }
  }

  public async createDigitalDebtServ(input?: any) {
    try {
      const asyncRes = await Promise.all(
        input.map(async (i: any) => {
          return await createDataIntoDigitalDebt(i)
        }),
      )
      return asyncRes
    } catch (e) {
      logger.error({
        error: `Error while creating reCompany socials in Db ${JSON.stringify(e)}`,
      })
      throw e
    }
  }

  public async createDigitalBondsServ(arrayJson: any) {
    try {
      arrayJson?.forEach(async (input: DigitalBondsInf) => {
        return await createDataIntoDigitalBonds(input)
      })
      return arrayJson
    } catch (e) {
      logger.error({
        error: `Error while creating create digital bonds serv Db ${JSON.stringify(e)}`,
      })
      throw e
    }
  }

  public async createDigitalArtsServ(arrayJson: any) {
    try {
      arrayJson?.forEach(async (input: DigitalArtworkInf) => {
        return await createDigitalArts(input)
      })
      return arrayJson
    } catch (e) {
      logger.error({
        error: `Error while creating create digital bonds serv Db ${JSON.stringify(e)}`,
      })
      throw e
    }
  }

  public async listDigitalDebtServ() {
    try {
      let resp = await listDigitalDebt()
      const bonds = await this.listDigitalBonds()
      resp = [...bonds, ...resp]
      const newData = resp?.map((d: any) => {
        return this.dataConverter.debtDataMapper(d)
      })
      return newData
    } catch (e) {
      ErrorHandleAndThrow(e, 'error while listing the digital debt')
    }
  }

  public async listDigitalBonds() {
    try {
      const resp = await listDigitalBondsDB()
      const newData = resp?.map((d: any) => {
        return this.dataConverter.bondsDataMapper(d)
      })
      return newData
    } catch (e) {
      ErrorHandleAndThrow(e, 'error while listing the digital debt')
    }
  }

  public async listDigitalArts() {
    try {
      const resp = await listDigitalArts()
      const newData = resp?.map((d: any) => {
        return this.dataConverter.artsDataMapper(d)
      })
      return newData
    } catch (e) {
      ErrorHandleAndThrow(e, 'error while listing the digital debt')
    }
  }

  public async getDigitalDebtServ(companyName: string, debtId: string) {
    try {
      return await getDigitalDebtDB(debtId, companyName)
    } catch (e) {
      ErrorHandleAndThrow(e, 'error while getting the digital debt')
    }
  }

  public readonly listLoftyBlockchainData = async (
    address: string = 'LOFTYRITC3QUX6TVQBGT3BARKWAZDEB2TTJWYQMH6YITKNH7IOMWRLC7SA',
  ) => {
    const endpoint = `https://node.algoexplorerapi.io/v2/accounts/${address}`
    try {
      const response = await axiosGet(endpoint)
      const assets = response['created-assets']
      const allData = Promise.all(
        assets.map(async (asset: any) => {
          const { index } = asset
          const { total, name } = asset.params
          const data = {
            blockchainName: 'algorand',
            deployingAddress: address,
            transactionHash: '',
            tickerSymbol: name,
            tokenId: index,
            totalTokens: total,
            tokenName: name,
          }
          return { blockchain: data }
        }),
      )
      return allData
    } catch (error) {
      ErrorHandler(error, 'Error while getting lofty blockchain data.')
    }
  }

  public readonly sanitizingDigitalReBucket = async () => {
    let listReIdsFromDB = await listDigitalReOnlyPK()
    listReIdsFromDB = listReIdsFromDB?.map((pk: any) => ({ id: pk.reId }))
    const c = new Set(listReIdsFromDB.map((obj: any) => obj?.[`id`]))
    const listIdsFromS3 = await listWebscrappingS3()
    const reIds = listIdsFromS3.CommonPrefixes.map(d => d.Prefix.replace('/', ''))
    const result = reIds.filter((obj: any) => {
      if (!obj.includes('webscrapping')) return !c.has(obj)
    })
    logger.info(`Records will be deleted from S3 : ${result.length}`)
    // delete ok
    result.forEach(async id => {
      const keys = await getAllKeysByPrefix(DIGITAL_RE_BUCKET, id)
      logger.info(`id : ${id}, Keys: ${JSON.stringify(keys)}`)
      keys.forEach(async k => {
        await deleteFile(k, DIGITAL_RE_BUCKET)
      })
    })
    return result
  }
  public async createAkruHistoricalDataServ() {
    try {
      const functionName =
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

      const reData = await queryDigitalReByCompanyName(PlatformName.Akru)

      reData.forEach(async item => {
        const { pk, sk, contractAddress } = item
        const latestBlockchainData = await this.fetchAkruBlockchainData(
          contractAddress,
          functionName,
        )
        await updateExistingDigitalREDb(
          {
            historicalData: latestBlockchainData,
          },
          { pk, sk },
        )
      })
      return 'done'
    } catch (e) {
      ErrorHandleAndThrow(e, 'error while creating the Historical data')
      return 'failed'
    }
  }

  public async migratingDBs({ key }) {
    const t0 = performance.now()
    if (STAGE === Environments.LOCAL || NODE_ENV === Environments.LOCAL) {
      key =
        '/Users/apdetroja/assume-role-repo/tools-account/ccr-3blk-tools-uea1-3blocks-core-vesta/dev-migrating-to-stge.csv'
    }
    const csvResultData = await readDataFromS3(key)
    await createExportedDataIntoDigitalRe(csvResultData)
    const t1 = performance.now()
    logger.info(`Execution took ${t1 - t0}ms to execute.`)
  }

  public async fetchHistoricalDataServ(reId: string, companyName: string) {
    try {
      const data = await getDigitalRealEstateDB(reId, companyName)
      if (data?.historicalData) {
        return { historicalData: data?.historicalData }
      } else {
        return { historicalData: [] }
      }
    } catch (e) {
      ErrorHandleAndThrow(e, 'Error while getting the historical data')
    }
  }

  public async createRoofStockHistoricalDataServ() {
    try {
      const functionName =
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

      const reData = await queryDigitalReByCompanyName(PlatformName.RoofStock)
      // const reData = [
      //   {
      //     pk: '#DRE#f47bf4d7-8397-4140-a159-4b967f5defe6',
      //     sk: 'roofstock',
      //     contractAddress: '0xF928d6285B8a4f9ac5A640ae598D7399C331cea7',
      //   },
      // ]
      reData.forEach(async item => {
        const { pk, sk, contractAddress } = item
        const latestBlockchainData = await this.getRoofstockBlockChainData(
          functionName,
          contractAddress,
        )
        await updateExistingDigitalREDb(
          {
            historicalData: latestBlockchainData,
          },
          { pk, sk },
        )
      })
      return 'done'
    } catch (e) {
      ErrorHandleAndThrow(e, 'error while creating the Historical data')
      return 'failed'
    }
  }

  public async fetchHotListingsServ(qStr: String) {
    try {
      if (qStr === QueryString.realestate) {
        const digitalRE = await listDigitalReDB()
        const sortedReData = await this.sortByCreated_at(digitalRE)

        const data: [ListDigitalReNameSpace.ListData] = sortedReData?.map((z: any) => {
          return this.dataConverter.listDigitalReMapper(z)
        })
        return data
      }
      if (qStr === QueryString.debt) {
        const digitalDebt = await listDigitalDebt()

        const sortedDebtData = await this.sortByCreated_at(digitalDebt)

        const data = sortedDebtData?.map((d: any) => {
          return this.dataConverter.debtDataMapper(d)
        })
        return data
      }
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  private deleteZillowProperties(zillow: any) {
    delete zillow?.photos
    delete zillow?.big
    delete zillow?.hugePhotos
    delete zillow?.priceHistory
    delete zillow?.responsivePhotos
    delete zillow?.responsivePhotosOriginalRatio
  }

  private async syncLoftyBlchainData() {
    const blockchain = await this.listLoftyBlockchainData()
    let i = 0
    const t0 = performance.now()
    for await (const bcdata of blockchain) {
      logger.info(`Picking item ${++i} `)
      const addresstoSearch = bcdata.blockchain.tokenName
        ?.replace('Lofty', '')
        ?.replace('LFTY0001', '')
        ?.trim()
      if (addresstoSearch === 'AI') continue
      logger.info(`Query on existing DB: ${addresstoSearch} `)
      const existingReData = await queryDataByAddress(addresstoSearch)
      if (Array.isArray(existingReData) && existingReData.length > 0) {
        if (existingReData[0]?.zillow) {
          await updateBlockchainData(bcdata, {
            pk: existingReData[0]?.pk,
            sk: existingReData[0]?.sk,
          })
        }
      } else {
        logger.info('Performing Zillow + Blockchain + Csv update Ops.')
        const reId = uuid()
        const data = [
          {
            [Keys.PK]: StartsWith.DIGITAL_RE + reId,
            [Keys.SK]: PlatformName.LoftY,
            fullAddress: addresstoSearch,
          },
        ]
        const finalData: any = await this.syncingZillow(data)
        const zillow = finalData?.zillow?.data
        let fullAddress = ''
        if (zillow !== 'Not Available') {
          fullAddress =
            zillow?.streetAddress +
            ' ' +
            zillow?.city +
            ' ' +
            zillow?.state +
            ' ' +
            zillow?.zipcode
        }
        const remaining = {
          [Keys.GSI1_SK]: fullAddress || addresstoSearch,
          [Keys.GSI1_PK]: StartsWith.DIGITAL_RE,
          reId,
          companyName: PlatformName.LoftY,
        }
        logger.info(`Inserting the new Data ${JSON.stringify(remaining)} `)
        const csv = this.dataConverter.preparingCsvDataFromZillow(zillow?.address)
        await updateBlockchainData(
          { ...bcdata, ...csv, ...remaining },
          { pk: data[0].pk, sk: data[0]?.sk },
        )
      }
    }
    const t1 = performance.now()
    logger.info(`Execution took ${t1 - t0}ms to execute for Lofty Platform.`)
  }

  private async syncRoofStockBlchainData(key: string, platformName: string) {
    let i = 0
    const t0 = performance.now()
    const companyName = platformName
    const blockchain = await readDataFromS3(key, true)
    for await (const bcdata of blockchain) {
      logger.info(`Picking item ${++i} `)
      const addresstoSearch = bcdata.name
      const existingReData = await queryDataByAddress(addresstoSearch)
      if (Array.isArray(existingReData) && existingReData.length > 0) {
        if (existingReData[0]?.zillow) {
          await updateBlockchainData(
            {
              blockchain: {
                blockchainName: 'Ethereum',
                deployingAddress: '0xF928d6285B8a4f9ac5A640ae598D7399C331cea7',
                tickerSymbol: bcdata?.symbol,
                tokenId: null,
                tokenName: bcdata?.symbol,
                totalTokens: bcdata?.totalSupply,
                transactionHash: null,
              },
            },
            {
              pk: existingReData[0]?.pk,
              sk: existingReData[0]?.sk,
            },
          )
        }
      } else {
        logger.info('Performing Zillow + Blockchain + Csv update Ops.')
        const reId = uuid()
        const data = [
          {
            [Keys.PK]: StartsWith.DIGITAL_RE + reId,
            [Keys.SK]: companyName,
            fullAddress: addresstoSearch,
          },
        ]
        const finalData: any = await this.syncingZillow(data)
        const zillow = finalData?.zillow?.data
        let fullAddress = ''
        if (zillow !== 'Not Available') {
          fullAddress =
            zillow?.streetAddress +
            ' ' +
            zillow?.city +
            ' ' +
            zillow?.state +
            ' ' +
            zillow?.zipcode
        }
        const remaining = {
          [Keys.GSI1_SK]: fullAddress || addresstoSearch,
          [Keys.GSI1_PK]: StartsWith.DIGITAL_RE,
          reId,
          companyName,
          contractAddress: bcdata?.address,
        }
        logger.info(`Inserting the new Data ${JSON.stringify(remaining)} `)
        const csv = this.dataConverter.preparingCsvDataFromZillow(zillow?.address)
        await updateBlockchainData(
          {
            blockchain: {
              blockchainName: 'Ethereum',
              deployingAddress: '0xF928d6285B8a4f9ac5A640ae598D7399C331cea7',
              tickerSymbol: bcdata?.symbol,
              tokenId: null,
              tokenName: bcdata?.symbol,
              totalTokens: bcdata?.totalSupply,
              transactionHash: null,
            },
            ...csv,
            ...remaining,
          },
          { pk: data[0].pk, sk: data[0]?.sk },
        )
      }
    }
    const t1 = performance.now()
    logger.info(`Execution took ${t1 - t0}ms to execute for ${companyName} Platform.`)
  }

  private async syncAkrukBlchainData(key: string, platformName: string) {
    let i = 0
    const t0 = performance.now()
    const blockchain = await readDataFromS3(key, true)
    const companyName = platformName
    const bdAddress = {
      blockchainName: 'Avalanche',
      deployingAddress: '0xFD01A2868caACaceB32636fa8A7391f732689Ef9',
    }
    for await (const bcdata of blockchain) {
      logger.info(`Picking item ${++i} `)
      const addresstoSearch = bcdata.name
      const existingReData = await queryDataByAddress(addresstoSearch)
      if (Array.isArray(existingReData) && existingReData.length > 0) {
        if (existingReData[0]?.zillow) {
          await updateBlockchainData(
            {
              blockchain: {
                ...bdAddress,
                tickerSymbol: bcdata?.symbol,
                tokenId: null,
                tokenName: bcdata?.symbol,
                totalTokens: bcdata?.totalSupply,
                transactionHash: null,
              },
            },
            {
              pk: existingReData[0]?.pk,
              sk: existingReData[0]?.sk,
            },
          )
        }
      } else {
        logger.info('Performing Zillow + Blockchain + Csv update Ops.')
        const reId = uuid()
        const data = [
          {
            [Keys.PK]: StartsWith.DIGITAL_RE + reId,
            [Keys.SK]: companyName,
            fullAddress: addresstoSearch,
          },
        ]
        const finalData: any = await this.syncingZillow(data)
        const zillow = finalData?.zillow?.data
        let fullAddress = ''
        if (zillow !== 'Not Available') {
          fullAddress =
            zillow?.streetAddress +
            ' ' +
            zillow?.city +
            ' ' +
            zillow?.state +
            ' ' +
            zillow?.zipcode
        }
        const remaining = {
          [Keys.GSI1_SK]: fullAddress || addresstoSearch,
          [Keys.GSI1_PK]: StartsWith.DIGITAL_RE,
          reId,
          companyName,
          contractAddress: bcdata?.address,
        }
        logger.info(`Inserting the new Data ${JSON.stringify(remaining)} `)
        const csv = this.dataConverter.preparingCsvDataFromZillow(zillow?.address)
        await updateBlockchainData(
          {
            blockchain: {
              ...bdAddress,
              tickerSymbol: bcdata?.symbol,
              tokenId: null,
              tokenName: bcdata?.symbol,
              totalTokens: bcdata?.totalSupply,
              transactionHash: null,
            },
            ...csv,
            ...remaining,
          },
          { pk: data[0].pk, sk: data[0]?.sk },
        )
      }
    }
    const t1 = performance.now()
    logger.info(`Execution took ${t1 - t0}ms to execute for ${companyName} Platform.`)
  }

  private async syncRealtBlchainData(key: string) {
    let i = 0
    const t0 = performance.now()
    const blockchain = await readDataFromS3(key, true)
    for await (const bcdata of blockchain) {
      logger.info(`Picking item ${++i} `)
      const addresstoSearch = bcdata.name?.replace('RealToken S ', '')?.trim()
      const existingReData = await queryDataByAddress(addresstoSearch)
      if (Array.isArray(existingReData) && existingReData.length > 0) {
        if (existingReData[0]?.zillow) {
          await updateBlockchainData(bcdata, {
            pk: existingReData[0]?.pk,
            sk: existingReData[0]?.sk,
          })
        }
      } else {
        logger.info('Performing Zillow + Blockchain + Csv update Ops.')
        const reId = uuid()
        const data = [
          {
            [Keys.PK]: StartsWith.DIGITAL_RE + reId,
            [Keys.SK]: PlatformName.REALt,
            fullAddress: addresstoSearch,
          },
        ]
        const finalData: any = await this.syncingZillow(data)
        const zillow = finalData?.zillow?.data
        let fullAddress = ''
        if (zillow !== 'Not Available') {
          fullAddress =
            zillow?.streetAddress +
            ' ' +
            zillow?.city +
            ' ' +
            zillow?.state +
            ' ' +
            zillow?.zipcode
        }
        const remaining = {
          [Keys.GSI1_SK]: fullAddress || addresstoSearch,
          [Keys.GSI1_PK]: StartsWith.DIGITAL_RE,
          reId,
          companyName: PlatformName.REALt,
          contractAddress: bcdata?.address,
        }
        logger.info(`Inserting the new Data ${JSON.stringify(remaining)} `)
        const csv = this.dataConverter.preparingCsvDataFromZillow(zillow?.address)
        await updateBlockchainData(
          {
            blockchain: {
              blockchainName: 'Gnosis',
              deployingAddress: '0x0B001A2D3ab1c1BCD56fEb0914A1Cfe4e239A7Cd',
              tickerSymbol: bcdata?.symbol,
              tokenId: null,
              tokenName: bcdata?.symbol,
              totalTokens: bcdata?.totalSupply,
              transactionHash: null,
            },
            ...csv,
            ...remaining,
          },
          { pk: data[0].pk, sk: data[0]?.sk },
        )
      }
    }
    const t1 = performance.now()
    logger.info(`Execution took ${t1 - t0}ms to execute for RealT Platform.`)
  }

  private readonly updateDigitalReDataToDB = async (
    _uniqueIds: any,
    _uniqueArr: any,
    platform: string,
    file: string,
  ) => {
    logger.info(`Update Operation for: ${file} and platform is: ${platform} `)
    if (_uniqueIds.length === 0 || _uniqueArr.length === 0) {
      _uniqueIds = await getExistingReData()
    }
    let counter = 0
    for await (const item of _uniqueIds) {
      // Extracting properties from Item object.
      const { address, pk, sk } = item
      logger.info(`Picking item: ${++counter} `)
      logger.info(`Calling zillow search API, address:${address} `)

      // Fetching the data from the Zillow APIs
      await this.syncingZillow([
        {
          pk,
          sk,
          fullAddress: address,
        },
      ])

      // Manually updation for the 3blocks data.
      if (platform === PlatformName['3Blocks']) {
        await updateExistingDigitalREDb(
          {
            blockchain: {
              totalTokens: item.blocks?.total_number_of_tokens,
              contractAddress: '0x6aa43165f4664a5e7c69678a9865e280162cf31f',
              blockchainName: '',
              tokenId: item?.blocks?.tokenId,
              tokenName: '',
              tickerSymbol: '',
              deployingAddress: '',
              transactionHash: '',
            },
          },
          { pk, sk },
        )
      } else {
        await updateExistingDigitalREDb(
          {
            blockchain: {
              totalTokens: '',
              contractAddress: '',
              blockchainName: '',
              tokenId: '',
              tokenName: '',
              tickerSymbol: '',
              deployingAddress: '',
              transactionHash: '',
            },
          },
          { pk, sk },
        )
      }
    }
  }

  private readonly preparingZillowData = async (address: string, _reId: string) => {
    logger.info(`Searching address: ${address} `)
    const zilloResponse = await this.getDigitalReDataByAddressService(address)
    if (isNumber(zilloResponse) && zilloResponse === 429) {
      return zilloResponse
    }
    if (IsValid(zilloResponse)) {
      // Uploading Image url to S3 bucket. Only considering webp files
      const photosAll = await photos(zilloResponse?.zpid)
      if (Array.isArray(photosAll?.photos)) {
        photosAll?.photos?.forEach(async source => {
          const url = source.mixedSources.webp[3].url
          try {
            await sleep(500)
            await downloadAttachment(url, _reId)
          } catch (e) {
            logger.error(`Url not found for ${url}`)
          }
        })
      }
    }
    return zilloResponse
  }

  // blockchain function to get transfer details of specific address
  private readonly getDatabyLogsBy = async (address, topic) => {
    try {
      const endpoint = `https://api.gnosisscan.io/api?module=logs&action=getLogs&address=${address}&page=1&offset=1000&apikey=${GNOSIS_API_KEY}`
      const response = await axiosGet(endpoint)
      let events = response.result.map(log => {
        return {
          data: parseInt(log.data, 16) / 10 ** 18,
          topics: log.topics,
          timestamp: parseInt(log.timeStamp, 16),
        }
      })
      events = events.filter(event => {
        return event.topics[0] === topic
      })
      const filteredTransactions = events.map(event => {
        const from = '0x' + event.topics[1].slice(26)
        const to = '0x' + event.topics[2].slice(26)
        return {
          data: event.data,
          from,
          to,
          timestamp: event.timestamp,
        }
      })
      return filteredTransactions
    } catch (e) {
      ErrorHandleAndThrow(e, 'Error while getting the contract address from blockchain')
    }
  }

  // akru historical data
  private async fetchAkruBlockchainData(address, topic) {
    const endpoint = `https://api.snowtrace.io/api?module=logs&action=getLogs&address=${address}&page=1&offset=1000&apikey=${SNOWTRACE_API_KEY}`

    const { result } = await axiosGet(endpoint)

    let events = result.map(log => {
      return {
        // data: parseInt(log.data, 16) / 10 ** 18,
        data: log.data,
        topics: log.topics,
        timestamp: parseInt(log.timeStamp, 16),
      }
    })
    events = events.filter(event => {
      return event.topics[0] === topic
    })
    let filteredTransactions = events.map(event => {
      const from = '0x' + event.topics[1].slice(26)
      const to = '0x' + event.topics[2].slice(26)
      return {
        data: parseInt(event.data, 16),
        from,
        to,
        timestamp: event.timestamp,
      }
    })
    if (filteredTransactions.length > 20) {
      filteredTransactions = filteredTransactions.slice(-20)
    }
    return filteredTransactions
  }

  // Roofstock historical data
  private async getRoofstockBlockChainData(topic, address) {
    const endpoint = `https://api.etherscan.io/api?module=logs&action=getLogs&address=${address}&page=1&offset=1000&apikey=${'H9ADQEWJ3X1QWUV9FNKYTHM452ZE5JKJNJ'}`

    const { result } = await axiosGet(endpoint)

    let events = result.map(log => {
      return {
        data: parseInt(log.data, 16) / 10 ** 18,
        topics: log.topics,
        timestamp: parseInt(log.timeStamp, 16),
      }
    })
    events = events.filter(event => {
      return event.topics[0] === topic
    })
    const filteredTransactions = events.map(event => {
      const from = '0x' + event.topics[1].slice(26)
      const to = '0x' + event.topics[2].slice(60)
      const data = parseInt(event.topics[3].slice(-32), 16)

      return {
        data,
        from,
        to,
        timestamp: event.timestamp,
      }
    })

    return filteredTransactions
  }

  private async sortByCreated_at(data) {
    // Sort the objects based on the created_at property in descending order
    data.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })

    const latestListings = data.slice(0, 3)

    return latestListings
  }
}
