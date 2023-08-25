import { TypeName } from '@core/enums'
import { Field, ObjectType } from '@nestjs/graphql'
import { NullableFalse } from '@utils/common.utils'
import { Custom } from '../coinify/create-payment.type'

@ObjectType(TypeName.PaymentIntentType)
export class PaymentIntentType extends Custom {
  @Field({
    ...NullableFalse,
    description: 'The client secret from stripe to complete payment.',
  })
  checkoutUrl: string
}
