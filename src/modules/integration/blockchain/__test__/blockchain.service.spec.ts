import { LoggerService } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { BlockchainService } from '../blockchain.service'
jest.mock('@db/blockchain/blockchain.db', () => ({
  saveTokenTransferDetails: async () => {
    result: 'Success'
  },
  getIsAddressWhitelisted: async () => {
    result: true
  },
}))

export class EmptyLogger implements LoggerService {
  log(_message: string): any {}
  error(_message: string, _trace: string): any {}
  warn(_message: string): any {}
  debug(_message: string): any {}
  verbose(_message: string): any {}
}
describe('BlockchainService', () => {
  let blockchainService: BlockchainService
  // let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainService],
    }).compile()

    // httpService = module.get<HttpService>(HttpService)
    blockchainService = module.get<BlockchainService>(BlockchainService)
  })

  it('should be defined', () => {
    expect(blockchainService).toBeDefined()
  })
})
