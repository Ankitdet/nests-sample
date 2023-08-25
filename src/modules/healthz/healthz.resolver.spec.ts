import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus'
import { Test } from '@nestjs/testing'
import { MemoryHealthIndicatorType } from '../../core/object-types/healthz/heathz.type'
import { HealthResolver } from './healthz.resolver'
import { healthMemoryHealthIndicatorTypeStub } from './tests/stub'

const healthCheckServiceFactory = () => ({
  check: jest.fn(),
})

const memoryHealthIndicatorFactory = () => ({
  checkRSS: jest.fn(),
})
const diskHealthIndicatorFactory = () => ({
  checkStorage: jest.fn(),
})

const httpHealthIndicatorFactory = () => ({
  pingCheck: jest.fn(),
})

describe('Healthz Resolver', () => {
  let healthCheck: HealthResolver
  let healthCheckService: HealthCheckService
  // let memoryHealthIndicatorService: MemoryHealthIndicator
  // let diskHealthIndicatorService: DiskHealthIndicator
  // let httpHealthIndicatorService: HttpHealthIndicator

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HealthResolver,
        {
          provide: HealthCheckService,
          useFactory: healthCheckServiceFactory,
        },
        {
          provide: MemoryHealthIndicator,
          useFactory: memoryHealthIndicatorFactory,
        },
        {
          provide: DiskHealthIndicator,
          useFactory: diskHealthIndicatorFactory,
        },
        {
          provide: HttpHealthIndicator,
          useFactory: httpHealthIndicatorFactory,
        },
      ],
    }).compile()

    healthCheck = moduleRef.get<HealthResolver>(HealthResolver)
    healthCheckService = moduleRef.get<HealthCheckService>(HealthCheckService)
    // memoryHealthIndicatorService =
    //   moduleRef.get<MemoryHealthIndicator>(MemoryHealthIndicator)
    // diskHealthIndicatorService = moduleRef.get<DiskHealthIndicator>(DiskHealthIndicator)
    // httpHealthIndicatorService = moduleRef.get<HttpHealthIndicator>(HttpHealthIndicator)
    jest.clearAllMocks()
  })
  describe('Health resolver', () => {
    it('should defined', () => {
      expect(healthCheck).toBeDefined()
    })
  })

  describe('Health Check', () => {
    describe('when health check graphql api called', () => {
      let memoryHealth: MemoryHealthIndicatorType
      it('should return sellers', async () => {
        jest.spyOn(healthCheckService, 'check').mockReturnValue({
          then: jest.fn().mockResolvedValueOnce({
            status: 'up',
            info: {
              disk: {
                status: 'up',
              },
              memory_rss: {
                status: 'up',
              },
              nestjsApplication: {
                status: 'up',
              },
            },
            error: 'error',
          }),
        } as any)

        memoryHealth = await healthCheck.healthCheck()
        expect(memoryHealth).toStrictEqual(healthMemoryHealthIndicatorTypeStub())
      })
    })
  })
})
