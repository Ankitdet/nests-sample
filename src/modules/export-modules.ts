import _ from 'lodash'
import { AWSSesModule } from './aws-ses/aws-ses.module'
import { AWSSqsModule } from './aws-sqs/aws-sqs.module'
import { ChainalysisModule } from './chainalysis/chainalysis.module'
// import { ChainalysisModule } from './chainalysis/chainalysis.module'
import { CheckoutModule } from './checkout/checkout.module'
import { HealthModule } from './healthz/healthz.module'
import { BitpayModule } from './integration/bitpay/bitpay.module'
import { AlchemyModule } from './integration/blockchain/blockchain.module'
import { CoinifyModule } from './integration/coinify/coinify.module'
import { OnfidoModule } from './integration/onfido/onfido.module'
import { PandaDocModule } from './integration/panda-doc/panda-doc.module'
import { StripeModule } from './integration/stripe/stripe.module'
import { RealEstateModule } from './real-estate/real-estate.module'
import { S3Module } from './s3-buckets/s3-buckets.module'
import { S3Resolver } from './s3-buckets/s3-buckets.resolver'
import { UserModule } from './user/user.module'
import { WebhookModule } from './webhook/webhook.module'
import { ZillowDigitalModule } from './zillow-digital/zillow-digital.module'

export const app = _.compact([
  HealthModule,
  OnfidoModule,
  RealEstateModule,
  S3Module,
  S3Resolver,
  BitpayModule,
  StripeModule,
  CheckoutModule,
  ChainalysisModule,
  WebhookModule,
  UserModule,
  CoinifyModule,
  AWSSesModule,
  PandaDocModule,
  AWSSqsModule,
  /* SocketModule
  socket.io implementations */
  AlchemyModule,
  CheckoutModule,
  ZillowDigitalModule,
  /* NODE_ENV === DEVELOPMENT ? BitpayModule : '', */
  // NODE_ENV === DEVELOPMENT ? UserModule : '',
])
