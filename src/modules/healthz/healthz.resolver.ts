import { AppResolver } from '@app/app.resolver'
import { QUERY_METHOD_DECORATOR } from '@core/decorators/query.decorator'
import { MemoryHealthIndicatorType } from '@core/object-types/healthz/heathz.type'
import { Query, Resolver } from '@nestjs/graphql'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus'
import checkDiskSpace from 'check-disk-space'

@Resolver(() => MemoryHealthIndicatorType)
export class HealthResolver extends AppResolver {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly http: HttpHealthIndicator,
  ) {
    super()
  }

  @HealthCheck()
  @Query(
    QUERY_METHOD_DECORATOR.healthzCheck.return,
    QUERY_METHOD_DECORATOR.healthzCheck.options,
  )
  async healthCheck(): Promise<MemoryHealthIndicatorType> {
    const { free, size } = await checkDiskSpace('/')

    const json: MemoryHealthIndicatorType = {
      status: '',
      info: {
        disk: {
          status: 'down',
        },
        memory_rss: {
          status: 'down',
        },
        nestjsApplication: {
          status: 'down',
        },
      },
      error: '',
    }

    return this.health
      .check([
        // async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
        async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
        async () =>
          this.disk.checkStorage('disk', { path: '/', threshold: size - free + 90000 }),
        async () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      ])
      .then(async a => {
        json.status = a.status
        json.info.disk.status = a.info.disk.status
        json.info.nestjsApplication.status = a.info['nestjs-docs'].status
        return json
      })
  }
}
