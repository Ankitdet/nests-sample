import { getInputName, InputName } from '@core/enums'
import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { AbstractTrue } from '@utils/common.utils'

@InputType(getInputName(InputName.WebhookEventInput), { ...AbstractTrue })
@ArgsType()
class Webhook {
  @Field({
    description: 'webhook calling.',
    nullable: true,
  })
  id: string
  @Field({
    description: 'webhook calling.',
    nullable: true,
  })
  url: string
  @Field({
    description: 'webhook calling.',
    nullable: true,
  })
  enabled: boolean
  @Field({
    description: 'webhook calling.',
    nullable: true,
  })
  href: string
  @Field({
    description: 'webhook calling.',
    nullable: true,
  })
  token: string
  @Field(() => [String], {
    description: 'webhook calling.',
    nullable: true,
  })
  environments: [string]
  @Field(() => [String], {
    description: 'webhook calling.',
    nullable: true,
  })
  events: [string]
}

@InputType(getInputName(InputName.OnfidoWebhookEventInput))
@ArgsType()
export class WebhookEventInput {
  @Field(() => [Webhook], {
    description: 'webhook calling.',
    nullable: true,
  })
  webhooks?: [Webhook]
}
