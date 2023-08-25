import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractTrue } from '@utils/common.utils'

export declare type HealthCheckStatus = 'up' | 'down'

@ObjectType(TypeName.Status, { ...AbstractTrue })
export class Status {
  @Field()
  status: HealthCheckStatus
}

@ObjectType(TypeName.MemoryHealthIndicatorTypeDetails, { ...AbstractTrue })
export class MemoryHealthIndicatorTypeDetails {
  @Field(() => Status, {
    nullable: true,
    description: 'memory rss - memory Health Indicator',
  })
  memory_rss?: Status

  @Field(() => Status, {
    nullable: true,
    description: 'disk - memory Health Indicator',
  })
  disk?: Status

  @Field(() => Status, {
    nullable: true,
    description: 'nestjs Application - memory Health Indicator',
  })
  nestjsApplication?: Status
}

@ObjectType(TypeName.MemoryHealthIndicator)
export class MemoryHealthIndicatorType {
  @Field({ nullable: false, description: 'status of the memory  Health Indicator' })
  status: string
  /**
   * The info object contains information of each health indicator
   * which is of status "up"
   */
  @Field(() => MemoryHealthIndicatorTypeDetails, {
    nullable: true,
    description: 'It contains information of memory Health Indicator',
  })
  info?: MemoryHealthIndicatorTypeDetails
  /**
   * The error object contains information of each health indicator
   * which is of status "down"
   */
  @Field({
    nullable: true,
    description:
      'Error object contains information of each Health Indicator - memory Health Indicator',
  })
  error?: string
}
