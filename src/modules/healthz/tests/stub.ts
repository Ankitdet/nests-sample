import { MemoryHealthIndicatorType } from '@core/object-types/healthz/heathz.type'

export const healthMemoryHealthIndicatorTypeStub = (): MemoryHealthIndicatorType => {
  return {
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
  }
}

/*

*/
