import { RealEstateListingInput } from '@core/inputs'
import {
  INoPropertFound,
  IRealEstateListing,
  RealEstateInterface,
} from '@core/interfaces'
import { FetchPropertyInput, RealEstateArgs } from '@core/args'
import { Test } from '@nestjs/testing'
import _ from 'lodash'
import { RealEstateResolver } from '../real-estate.resolver'
import { RealEstateService } from '../real-estate.service'
import {
  realEstateBasicInfo,
  realEstateBasicInfoFromUI,
  realEstateFinanceStub,
} from '../../../core/stubs/real-estate.stub'
jest.mock('../realEstate.service')
describe('real estate resolver', () => {
  let realEstateResolver: RealEstateResolver
  let realestateService: RealEstateService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RealEstateResolver, RealEstateService],
    }).compile()

    realEstateResolver = moduleRef.get<RealEstateResolver>(RealEstateResolver)
    realestateService = moduleRef.get<RealEstateService>(RealEstateService)
    jest.clearAllMocks()
  })
  describe('create or search property', () => {
    it('should return realEstate property data.', async () => {
      let realEstate: RealEstateInterface
      let input = new RealEstateArgs({
        re_id: 'Commodi iure soluta quas quia.',
        platformListFeesInPercentage: 1,
        rentProcessingFees: 2,
        propertyMgmtFees: 9,
        maintenanceExpenseInPercentage: 2,
        assetPrice: 31,
        closingCost: 42,
        expectedReserveFunds: 1,
        renovationCosts: 1,
        propertyTaxes: 20,
        insurance: 16,
        utilities: 0,
        expectedGrossRentPerProperty: 4,
      })
      const spy = jest
        .spyOn(realestateService, 'createPropertyFinance')
        .mockResolvedValue(realEstateFinanceStub())
      realEstate = await realEstateResolver.add(input)
      expect(spy).toHaveBeenCalled()
      expect(realEstate).toEqual(realEstateFinanceStub())
    })
  })

  describe('create finance data', () => {
    it('should return realEstate basic info data.', async () => {
      let realEstate: IRealEstateListing | INoPropertFound
      let input = new FetchPropertyInput({
        streetAddress: 'Et similique ratione non qui dolores a nisi',
        city: 'Quam ratione voluptate soluta. Voluptatem assumenda qui voluptate labore',
        state:
          'Consequuntur perferendis neque tempora quis nulla est ut reprehenderit.',
        zipCode: 47,
      })
      const spy = jest
        .spyOn(realestateService, 'createOrSearchProperty')
        .mockResolvedValue(realEstateBasicInfo())
      realEstate = await realEstateResolver.propertyBasicInfo(input, null)
      expect(spy).toHaveBeenCalled()
      const returnData = realEstateBasicInfo()
      returnData['boundary'].geojson.coordinates = _.flatMap(
        returnData?.['boundary']?.geojson?.coordinates,
      )
      expect(realEstate).toEqual(returnData)
    })
  })

  describe('create real estate basic info data', () => {
    it('should return realEstate basic info data.', async () => {
      let realEstate: IRealEstateListing
      let input = new RealEstateListingInput({
        address: {},
        assessments: [
          {
            year: 2021,
            land_value: 52120,
            improvement_value: 212710,
            total_value: 264830,
          },
        ],
        boundary: {},
        createdAt: '',
        deeds: [{}],
        market_assessments: [{}],
        metadata: {},
        owner: {},
        parcel: {},
        structure: {},
        taxes: [{}],
        updatedAt: '',
        valuation: {},
        user_id: '',
      })
      const spy = jest
        .spyOn(realestateService, 'createRealEstateBasicInfo')
        .mockResolvedValue(realEstateBasicInfoFromUI())
      realEstate = await realEstateResolver.createReBasicInfo(input, { userId: 100 })
      expect(spy).toHaveBeenCalled()
      const returnData = realEstateBasicInfo()
      expect(realEstate).toEqual(returnData)
    })
  })
})
