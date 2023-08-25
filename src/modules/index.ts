// Here exported module can directly used in lambda function.
// The intention of making this file is to identify the dependency to each.
// We can avoid the lots of error regarding the Circular Dependecy

import { DataConverter } from '@core/converters/zillow.converter'
import { HttpService } from '@nestjs/axios'
import { AWSSesService } from './aws-ses/aws-ses.service'
import { AWSSqsService } from './aws-sqs/aws-sqs.service'
import { ChainalysisService } from './chainalysis/chainalysis.service'
import { CheckoutService } from './checkout/checkout.service'
import { BlockchainResolver } from './integration/blockchain/blockchain.resolver'
import { BlockchainService } from './integration/blockchain/blockchain.service'
import { PandaDocService } from './integration/panda-doc/panda-doc.service'
import { StripeService } from './integration/stripe/stripe.service'
import { UserService } from './user/user.service'
import { WebhookService } from './webhook/webhook.service'
import { ZilloDigitalService } from './zillow-digital/zilow-digital.service'

const httpService = new HttpService()
export const alchemyService = new BlockchainService(httpService)
const alchemyResolver = new BlockchainResolver(alchemyService)
const chainalysisService = new ChainalysisService(httpService)
export const userService = new UserService(
  alchemyResolver,
  httpService,
  chainalysisService,
)
const sesService = new AWSSesService(httpService)
const pandadocService = new PandaDocService(httpService)

// const pandaDocResolver = new PandaDocResolver(pandadocService, userService)
export const checkoutService = new CheckoutService(
  sesService,
  // userService,
  alchemyService,
)

export const sqsService = new AWSSqsService(alchemyService, checkoutService)

export const webhookService = new WebhookService(
  httpService,
  pandadocService,
  sqsService,
  userService,
  sesService,
)
export const awsSesService = new AWSSesService(httpService)

export const stripeService = new StripeService(httpService, checkoutService)

// To define all kind of mapping in this class.
export const zilloConverter = new DataConverter()

export const zillowService = new ZilloDigitalService(httpService, zilloConverter)
