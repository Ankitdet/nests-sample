import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { NullableTrue } from '@utils/common.utils'

@ObjectType(TypeName.WebhookEventType)
class Webhook {
  @Field({
    ...NullableTrue,
    description: 'webhook calling.',
  })
  id: string
  @Field({
    ...NullableTrue,
    description: 'webhook calling.',
  })
  url: string
  @Field({
    ...NullableTrue,
    description: 'webhook calling.',
  })
  enabled: boolean
  @Field({
    ...NullableTrue,
    description: 'webhook calling.',
  })
  href: string
  @Field({
    ...NullableTrue,
    description: 'webhook calling.',
  })
  token: string
  @Field(() => [String], {
    ...NullableTrue,
    description: 'webhook calling.',
  })
  environments: [string]
  @Field(() => [String], {
    ...NullableTrue,
    description: 'webhook calling.',
  })
  events: [string]
}

@ObjectType(TypeName.OnfidoWebhookEventType)
export class WebhookEventTypeObject {
  @Field(() => [Webhook], {
    ...NullableTrue,
    description: 'webhook calling.',
  })
  webhooks?: [Webhook]
}
