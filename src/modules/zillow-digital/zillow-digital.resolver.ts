import { AppResolver } from '@app/app.resolver'
import { DIGITAL_RE_BUCKET } from '@const/environments'
import { MUTATION_METHOD_DECORATOR } from '@core/decorators'
import { QUERY_METHOD_DECORATOR } from '@core/decorators/query.decorator'
import { CompanyUrls } from '@core/enums'
import { artsInput, debtsInput, digitalBonds } from '@core/inputs'
import { ScalarObjectType, UploadedType } from '@core/object-types'
import { CompanyInput } from '@core/object-types/zillow-digital/zillow-digital.type'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ExecuteForLocalOnly } from '@shared/decorators/dev-env.decorator'
import { ErrorHandleAndThrow } from '@shared/errors/axios-errors'
import { logger } from '@shared/logger/logger'
import { deleteFile, getS3Key } from '@utils/index'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { downloadAttachment, uploadUtil } from '../s3-buckets/s3utils'
import { ZilloDigitalService } from './zilow-digital.service'

@Resolver()
export class ZillowDigitalResolver extends AppResolver {
  /*eslint no-empty: "error"*/
  constructor(public readonly zilloDigitalService: ZilloDigitalService) {
    super()
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.getZillowDataByAddress.return,
    QUERY_METHOD_DECORATOR.zilloDigital.getZillowDataByAddress.options,
  )
  async getDigitalReDataByAddress(
    @Args('address', {
      name: 'address',
      description: 'physical address.',
      type: () => String,
    })
    address: string,
  ): Promise<any> {
    const resp = await this.zilloDigitalService.getDigitalReDataByAddressService(
      address,
    )
    return { data: resp }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.downloadImageToS3.return,
    QUERY_METHOD_DECORATOR.zilloDigital.downloadImageToS3.options,
  )
  async downloadImageToS3(
    @Args('url') url: string,
    @Args('re_id') reId: string,
  ): Promise<any> {
    await downloadAttachment(url, reId)
    logger.info(`Successfully download & uploaded.`)
    return 'Successfully download & uploaded'
  }

  @Mutation(() => [UploadedType])
  async uploadMultipleCsvs(
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    files: FileUpload[],
  ): Promise<any> {
    const fileUpload = []
    const promises = files.map(async file => {
      const { filename, mimetype, encoding, createReadStream } = await file
      const fileStream = createReadStream()
      const key = getS3Key(filename)
      // Avoid misleading files
      if (key) {
        return uploadUtil(fileStream, mimetype, encoding, key, DIGITAL_RE_BUCKET).then(
          base64 => {
            fileUpload.push(base64)
          },
        )
      }
    })
    // Wait for all Promises to complete
    return await Promise.all(promises)
      .then(async _results => {
        return fileUpload
        /*
        [
            {
                "Location": "https://s3-3blk-digitalre-dev-uea1-std-3blocks-analytics-web-source.s3.amazonaws.com/testfile",
                "Key": "testfile"
            },
        ]*/
      })
      .catch(e => {
        ErrorHandleAndThrow(e)
      })
  }

  @Query(() => ScalarObjectType, {
    name: 'harness',
  })
  async getSecret(@ExecuteForLocalOnly() _any: any): Promise<any> {
    return {
      // payload: await this.zilloDigitalService.deleteReIdsfromS3(),
    }
    // const resp = await zestimateHistory(20476225)
    // logger.info(`harness ${JSON.stringify(resp)}`)
    /*    logger.info(`harness`)
       return {
         payload: {},
       } */
  }

  @Query(() => String, {
    name: 'deleteFile',
    description: 'local testing - not using direct api.',
  })
  async deleteFile(
    @Args('key', {
      name: 'key',
      description: 'key.',
      type: () => String,
    })
    key: string,
    @Args('bucketName', {
      name: 'bucketName',
      description: 'bucketName',
      type: () => String,
    })
    bucketName: string,
  ): Promise<any> {
    await deleteFile(key, bucketName)
    return 'Delete done !!!'
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.getChartDataByAddress.return,
    QUERY_METHOD_DECORATOR.zilloDigital.getChartDataByAddress.options,
  )
  async getChartDataByAddress(
    @Args('address', { description: 'address or contract addres' })
    address: string,
    @Args('days', { description: 'provide days in string' })
    days: string,
  ) {
    try {
      const chartData = await this.zilloDigitalService.getChartDataByAddressService(
        address,
        days,
      )
      return chartData
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalRealEstate.return,
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalRealEstate.options,
  )
  async listDigitalRealEstate(
    // @Args('nextCursor') nextCursor: StartKeyInput,
    @Args('limit', { nullable: true }) _limit: number,
  ) {
    try {
      const zillowData = await this.zilloDigitalService.listDigitalReService()
      return { data: { zillow: zillowData, totalCount: zillowData.res.length } }
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }
  @Mutation(
    MUTATION_METHOD_DECORATOR.zilloDigital.createReCompany.return,
    MUTATION_METHOD_DECORATOR.zilloDigital.createReCompany.options,
  )
  async createReCompanySocials(@Args('input') input: CompanyInput) {
    try {
      return await this.zilloDigitalService.createReCompanySocialsService(input)
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }
  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.getDigitalReCompany.return,
    QUERY_METHOD_DECORATOR.zilloDigital.getDigitalReCompany.options,
  )
  async getDigitalReCompany(@Args('companyName') companyName: string) {
    try {
      const data = await this.zilloDigitalService.getDigitalReCompanyService(
        companyName,
      )
      return data || {}
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.listContractAddrByCompany.return,
    QUERY_METHOD_DECORATOR.zilloDigital.listContractAddrByCompany.options,
  )
  async listContractAddrByCompany(
    @Args('realTDeployer', { description: 'provide deploy contract address in string' })
    realTDeployer: string,
    @Args('functionName', { description: 'provide name of function in string' })
    functionName: string,
  ) {
    try {
      return await this.zilloDigitalService.listContractAddrByCompanyService(
        realTDeployer,
        functionName,
      )
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.getDigitalRealEstate.return,
    QUERY_METHOD_DECORATOR.zilloDigital.getDigitalRealEstate.options,
  )
  async getDigitalRealEstate(
    @Args('reId', { description: 'provide the real estate id.' })
    reId: string,
    @Args('companyName', { description: 'provide name of company' })
    companyName: string,
  ) {
    try {
      return {
        data: await this.zilloDigitalService.getDigitalRealEstateService(
          reId,
          companyName,
        ),
      }
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.getMarketCapitalisation.return,
    QUERY_METHOD_DECORATOR.zilloDigital.getMarketCapitalisation.options,
  )
  async getMarketCapitalisation() {
    try {
      return {
        data: await this.zilloDigitalService.getMarketCapitalisation(),
      }
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.companyUrlMapping.return,
    QUERY_METHOD_DECORATOR.zilloDigital.companyUrlMapping.options,
  )
  async companyUrlMapping() {
    const d = []
    for (const data in CompanyUrls) {
      d.push({ key: data, value: CompanyUrls[data] })
    }
    return d
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.getTraditionalInfo.return,
    QUERY_METHOD_DECORATOR.zilloDigital.getTraditionalInfo.options,
  )
  async getTraditionalInfo(
    @Args('reId', { description: 'provide the real estate id.' })
    reId: string,
    @Args('companyName', { description: 'provide name of company' })
    companyName: string,
  ) {
    try {
      return await this.zilloDigitalService.getTraditionalInfo(reId, companyName)
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.zilloDigital.createDigitalDebt.return,
    MUTATION_METHOD_DECORATOR.zilloDigital.createDigitalDebt.options,
  )
  async createDigitalDebt(
    @Args('input', { description: 'from where you want to start' }) startIndex: number,
  ) {
    try {
      const input = debtsInput.slice(startIndex, debtsInput.length)
      return {
        data: await this.zilloDigitalService.createDigitalDebtServ(input),
      }
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.zilloDigital.createDigitalBonds.return,
    MUTATION_METHOD_DECORATOR.zilloDigital.createDigitalBonds.options,
  )
  async createDigitalBonds() {
    const input = digitalBonds
    try {
      return {
        bonds: await this.zilloDigitalService.createDigitalBondsServ(input),
      }
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Mutation(
    MUTATION_METHOD_DECORATOR.zilloDigital.createDigitalArts.return,
    MUTATION_METHOD_DECORATOR.zilloDigital.createDigitalArts.options,
  )
  async createDigitalArts() {
    const input = artsInput
    try {
      return {
        arts: await this.zilloDigitalService.createDigitalArtsServ(input),
      }
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalArts.return,
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalArts.options,
  )
  async listDigitalArts() {
    try {
      return await this.zilloDigitalService.listDigitalArts()
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }
  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalBonds.return,
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalBonds.options,
  )
  async listDigitalBonds() {
    try {
      return await this.zilloDigitalService.listDigitalBonds()
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalDebt.return,
    QUERY_METHOD_DECORATOR.zilloDigital.listDigitalDebt.options,
  )
  async listDigitalDebt() {
    try {
      return await this.zilloDigitalService.listDigitalDebtServ()
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }

  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.getDigitalDebt.return,
    QUERY_METHOD_DECORATOR.zilloDigital.getDigitalDebt.options,
  )
  async getDigitalDebt(
    @Args('reId', { description: 'provide the real estate id.' })
    reId: string,
    @Args('companyName', { description: 'provide name of company' })
    companyName: string,
  ) {
    try {
      return await this.zilloDigitalService.getDigitalDebtServ(companyName, reId)
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }
  @Mutation(() => String)
  async createAkruHistoricalData() {
    return await this.zilloDigitalService.createAkruHistoricalDataServ()
  }
  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.fetchHistoricalData.return,
    QUERY_METHOD_DECORATOR.zilloDigital.fetchHistoricalData.options,
  )
  async fetchHistoricalData(
    @Args('reId', { description: 'provide the real estate id.' })
    reId: string,
    @Args('companyName', { description: 'provide name of company' })
    companyName: string,
  ) {
    try {
      return await this.zilloDigitalService.fetchHistoricalDataServ(reId, companyName)
    } catch (e) {
      ErrorHandleAndThrow(e)
    }
  }
  @Mutation(() => String)
  async createRoofStockHistoricalData() {
    return await this.zilloDigitalService.createRoofStockHistoricalDataServ()
  }
  @Mutation(() => String)
  async createRealTHistoricalData() {
    return await this.zilloDigitalService.createRealTHistoricalDataServ()
  }
  @Query(
    QUERY_METHOD_DECORATOR.zilloDigital.fetchHotListings.return,
    QUERY_METHOD_DECORATOR.zilloDigital.fetchHotListings.options,
  )
  async fetchHotListings(
    @Args('qStr', {
      description: 'provide the qStr ex: (realestate or debt in lowercase).',
    })
    qStr: string,
  ) {
    try {
      const resp = await this.zilloDigitalService.fetchHotListingsServ(qStr)
      return { data: resp }
    } catch (e) {
      ErrorHandleAndThrow(e)
      return { data: [] }
    }
  }
}
