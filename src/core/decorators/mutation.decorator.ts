import { descriptionOf, getRouterName, RouterName } from '@core/enums/router-name.enum'
import {
  ApplicantType,
  ApplyReffralCode,
  BuyTokensType,
  ChecksType,
  CreateCognitoUserType,
  OnfidoLivePhotoType,
  OnfidoUploadDocumentType,
  OrderType,
  PaymentIntentType,
  PaymentType,
  PPMDcoumentType,
  ReFullListingType,
  ReFullLisTwithFinanceType,
  ScalarObjectType,
  SubscriptionAgreementType,
  TransferDataType,
  UpdateAgreementType,
  UpdateCognitoUserType,
  UpdateEthereumAddressType,
  UpdateSmartContractType as UpdateSmartContractAndAdditionalType,
  UserType,
} from '@core/object-types'
import { SubmitWorkflowResponseType } from '@core/object-types/integration/onfido/submit-workflow-run'
import {
  CreateDigitalArtsType,
  CreateDigitalBondsType,
  CreateDigitalDebtType01,
  CreateReCompanyType,
} from '../object-types/zillow-digital/zillow-digital.type'

export const MUTATION_METHOD_DECORATOR = {
  buyTokens: {
    return: () => BuyTokensType,
    options: {
      description: descriptionOf[RouterName.buyTokens],
      name: getRouterName(RouterName.buyTokens),
      complexity: 10,
    },
  },
  createSeller: {
    return: () => UserType,
    options: {
      description: descriptionOf[RouterName.createUser],
      name: getRouterName(RouterName.createUser),
      complexity: 2,
    },
  },
  updateSeller: {
    return: () => [UserType],
    options: {
      description: descriptionOf[RouterName.updateUser],
      name: getRouterName(RouterName.updateUser),
    },
  },
  deleteSeller: {
    return: () => Boolean,
    options: {
      description: 'Request for deletion of a user',
      name: getRouterName(RouterName.deleteUser),
    },
  },
  realEstateFinance: {
    return: () => ReFullLisTwithFinanceType,
    options: {
      description: descriptionOf[RouterName.createRealEstateFinance],
      name: getRouterName(RouterName.createRealEstateFinance),
    },
  },
  realEstateBasicInfo: {
    return: () => ReFullListingType,
    options: {
      description: 'create real-estate basic info, take the input from UI',
      name: getRouterName(RouterName.createRealEstateBasicInfo),
    },
  },
  fetchRealEstateBasicInfo: {
    return: () => ReFullListingType,
    options: {
      description:
        'search real-estate basic info, passing city,addr1,addr2 and zip. estate involved',
      name: getRouterName(RouterName.fetchRealEstateBasicInfo),
      complexity: 5,
    },
  },
  createApplicant: {
    return: () => ApplicantType,
    options: {
      description: 'create applicant based on inputs - onfido integration',
      name: getRouterName(RouterName.createApplicant),
    },
  },
  updateApplicant: {
    return: () => ApplicantType,
    options: {
      description: 'update applicant based on inputs - onfido integration',
      name: getRouterName(RouterName.updateApplicant),
    },
  },
  uploadDocuments: {
    return: () => OnfidoUploadDocumentType,
    options: {
      description: 'upload documents - onfido integration',
      name: getRouterName(RouterName.uploadDocument),
    },
  },
  uploadLivePhoto: {
    return: () => OnfidoLivePhotoType,
    options: {
      description: 'upload documents(Live photos) - onfido integration',
      name: getRouterName(RouterName.uploadLivePhoto),
    },
  },
  createChecks: {
    return: () => ChecksType,
    options: {
      description: 'create checks - onfido integration',
      name: getRouterName(RouterName.createChecks),
    },
  },
  generateSdkToken: {
    return: () => String,
    options: {
      description: 'generate Sdk token - onfido integration',
      name: getRouterName(RouterName.generateSdkToken),
    },
  },
  createStripePaymentIntent: {
    return: () => PaymentIntentType,
    options: {
      description: 'create payment intent - stripe integration',
      name: getRouterName(RouterName.createStripePaymentIntent),
    },
  },
  cancelStripePaymentIntent: {
    return: () => String,
    options: {
      description: 'cancel payment intent - stripe integration',
      name: getRouterName(RouterName.cancelStripePaymentIntent),
    },
  },
  test: {
    return: () => ScalarObjectType,
    options: {
      description: 'testing jsonobject - no need to test',
      name: 'testJson',
    },
  },
  createInvoice: {
    return: () => String,
    options: {
      description: 'create invoice - bitpay integration',
      name: getRouterName(RouterName.createInvoice),
    },
  },
  createOrder: {
    return: () => OrderType,
    options: {
      description: 'create order for checkout',
      name: getRouterName(RouterName.createOrder),
    },
  },
  createCognitoUser: {
    return: () => CreateCognitoUserType,
    options: {
      description: 'create user from cognito.',
      name: getRouterName(RouterName.createUserInDynamo),
    },
  },
  updateCognitoUser: {
    return: () => UpdateCognitoUserType,
    options: {
      description: 'create user from cognito.',
      name: getRouterName(RouterName.updateCognitoUser),
    },
  },
  createCoinifyPayment: {
    return: () => PaymentType,
    options: {
      description: 'create payment - coinify integration',
      name: getRouterName(RouterName.createCoinifyPayment),
    },
  },
  submitWorkflowResponse: {
    return: () => SubmitWorkflowResponseType,
    options: {
      description: 'submit onfido workflow run response',
      name: getRouterName(RouterName.submitWorkflowResponse),
    },
  },
  updateEthereumAddress: {
    return: () => UpdateEthereumAddressType,
    options: {
      description: 'update ethereum address',
      name: getRouterName(RouterName.updateEthereumAddress),
    },
  },
  updateTokenTransfer: {
    return: () => TransferDataType,
    options: {
      description: 'transfer tokens and add details in db',
      name: getRouterName(RouterName.updateTokenTransfer),
    },
  },
  updateSmartContractAndAdditionalInfo: {
    return: () => UpdateSmartContractAndAdditionalType,
    options: {
      description: 'update smart contract and token based and additional info on reid',
      name: getRouterName(RouterName.updateSmartContractAndAdditionalInfo),
    },
  },
  updatePpmOrOperatingDocAgreement: {
    return: () => PPMDcoumentType,
    options: {
      description: 'update ppm doc agreement',
      name: getRouterName(RouterName.updatePpmOrOperatingDocAgreement),
    },
  },
  updateOperatingOrSubscriptionAgreement: {
    return: () => UpdateAgreementType,
    options: {
      description: 'update operating and subscription doc agreement',
      name: getRouterName(RouterName.updateOperatingOrSubscriptionAgreement),
    },
  },
  createSubscriptionAgreement: {
    return: () => SubscriptionAgreementType,
    options: {
      description: 'create subscription agreement ',
      name: getRouterName(RouterName.createSubscriptionAgreement),
    },
  },
  mintingAddressAndSettingUri: {
    return: () => String,
    options: {
      description: 'minting the uri and setting up uri',
      name: getRouterName(RouterName.mintingAddressAndSetUri),
    },
  },
  applyReffralCode: {
    return: () => ApplyReffralCode,
    options: {
      description: 'apply refferal code.',
      name: getRouterName(RouterName.applyReferralCode),
    },
  },
  zilloDigital: {
    createReCompany: {
      return: () => CreateReCompanyType,
      options: {
        description: descriptionOf[RouterName.createReCompany],
        name: getRouterName(RouterName.createReCompany),
      },
    },
    createDigitalDebt: {
      return: () => CreateDigitalDebtType01,
      options: {
        description: descriptionOf[RouterName.createDigitalDebt],
        name: getRouterName(RouterName.createDigitalDebt),
      },
    },
    createDigitalBonds: {
      return: () => CreateDigitalBondsType,
      options: {
        description: descriptionOf[RouterName.createDigitalBonds],
        name: getRouterName(RouterName.createDigitalBonds),
      },
    },
    createDigitalArts: {
      return: () => CreateDigitalArtsType,
      options: {
        description: descriptionOf[RouterName.createDigitalArts],
        name: getRouterName(RouterName.createDigitalArts),
      },
    },
  },
}
