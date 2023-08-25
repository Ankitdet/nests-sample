import { descriptionOf, getRouterName, RouterName } from '@core/enums/router-name.enum'
import {
  AddressSanctioned,
  AgreementDocumentLinkType,
  ApplicantType,
  ChecksType,
  GetCognitoUserType,
  IsAddressWhitelistedReturnType,
  JwtAccessToken,
  JwtTokenType,
  ListObjectsOutputType,
  MemoryHealthIndicatorType,
  OnfidoLivePhotoType,
  OnfidoUploadDocumentType,
  PPMDcoumentType,
  RealEstateAndFinanceType,
  RealEstateAndFinanceType1,
  ReFullListingType,
  // UserType,
  ReFullLisTwithFinanceType,
  ReportsType,
  SubscriptionAgreementType,
  TransferDataType,
  UserReferralType,
  WhitelistAddressesType,
  WorkFlowRunType,
} from '@core/object-types'
import {
  ChartDataType,
  CompanyContractData,
  CompanyData,
  GetDigitalReCompanyType,
  GetMarketCapitalisation,
  HistoricalDataType,
  HostListingsType,
  ZilloDigitalREDataType,
  ZillowDataByAddressType,
} from '@core/object-types/zillow-digital/zillow-digital.type'
import { JSONObject } from '@shared/scalar/json.scalar'

export const QUERY_METHOD_DECORATOR = {
  healthzCheck: {
    return: () => MemoryHealthIndicatorType,
    options: {
      description: 'Check health of application',
      name: getRouterName(RouterName.healthzCheck),
    },
  },
  getApplicantById: {
    return: () => ApplicantType,
    options: {
      description: 'get applicant by id',
      name: getRouterName(RouterName.getApplicantById),
    },
  },
  listApplicants: {
    return: () => [ApplicantType],
    options: {
      description: 'list applicants',
      name: getRouterName(RouterName.listApplicants),
    },
  },
  retrieveDocument: {
    return: () => OnfidoUploadDocumentType,
    options: {
      description: 'retrieveDocument - onfido integration',
      name: getRouterName(RouterName.retrieveDocument),
    },
  },
  listDocuments: {
    return: () => [OnfidoUploadDocumentType],
    options: {
      description: 'listDocuments - onfido integration',
      name: getRouterName(RouterName.listDocuments),
    },
  },
  retrieveLivePhoto: {
    return: () => OnfidoLivePhotoType,
    options: {
      description: 'retrieveLivePhoto- onfido integration',
      name: getRouterName(RouterName.retrieveLivePhoto),
    },
  },
  listLivePhotoes: {
    return: () => [OnfidoLivePhotoType],
    options: {
      description: 'listLivePhotoes- onfido integration',
      name: getRouterName(RouterName.listLivePhotoes),
    },
  },
  retrieveChecks: {
    return: () => ChecksType,
    options: {
      description: 'retrieveChecks- onfido integration',
      name: getRouterName(RouterName.retrieveChecks),
    },
  },
  listChecks: {
    return: () => [ChecksType],
    options: {
      description: 'listChecks- onfido integration',
      name: getRouterName(RouterName.listChecks),
    },
  },
  retrieveReports: {
    return: () => ReportsType,
    options: {
      description: 'retrieveReports- onfido integration',
      name: getRouterName(RouterName.retrieveReports),
    },
  },
  listReports: {
    return: () => [ReportsType],
    options: {
      description: 'listReports- onfido integration',
      name: getRouterName(RouterName.listReports),
    },
  },
  getRealEstateBasicInfoById: {
    return: () => ReFullListingType,
    options: {
      description: 'get real estate basic data by passing unique re_id',
      name: getRouterName(RouterName.getRealEstateBasicInfoById),
    },
  },
  getRealEstateInfoListByIds: {
    return: () => [RealEstateAndFinanceType],
    options: {
      description: 'get all real estate.',
      name: getRouterName(RouterName.getRealEstateInfoListByIds),
    },
  },
  getRealEstateInfoList: {
    return: () => [RealEstateAndFinanceType1], // RealEstateAndFinanceType1,
    options: {
      description: 'get all real estate - all',
      name: getRouterName(RouterName.getRealEstateInfoList),
    },
  },
  getRealEstateInfoById: {
    return: () => RealEstateAndFinanceType,
    options: {
      description: 'get all real estate.',
      name: getRouterName(RouterName.getRealEstateInfoById),
    },
  },
  getRealEstateFinanceByReId: {
    return: () => ReFullLisTwithFinanceType,
    options: {
      description: 'get real estate finance data by passing unique re_id',
      name: getRouterName(RouterName.getRealEstateFinanceByReId),
    },
  },
  addressSanctioned: {
    return: () => AddressSanctioned,
    options: {
      description: 'get the address is sanctioned or not.',
      name: getRouterName(RouterName.addressSanctioned),
    },
  },
  getUserAccess: {
    return: () => GetCognitoUserType,
    options: {
      description: 'get user access details.',
      name: getRouterName(RouterName.getUserAccess),
    },
  },
  loggedInUserAccess: {
    return: () => GetCognitoUserType,
    options: {
      description: 'get logged in user detail.',
      name: getRouterName(RouterName.loggedInUserAccess),
    },
  },
  accessToken: {
    return: () => JwtTokenType,
    options: {
      description: 'get access token, id token and refresh token',
      name: getRouterName(RouterName.getAccessToken),
    },
  },
  refreshSession: {
    return: () => JwtAccessToken,
    options: {
      description: 'refreshing the session.',
      name: getRouterName(RouterName.refreshSession),
    },
  },
  getTokenData: {
    return: () => TransferDataType,
    options: {
      description: 'transfer tokens',
      name: getRouterName(RouterName.tokenTransfer),
    },
  },
  whitelistAddresses: {
    return: () => WhitelistAddressesType,
    options: {
      description: 'Whitelist a list of addresses',
      name: getRouterName(RouterName.whitelistAddresses),
    },
  },
  isAddressWhitelisted: {
    return: () => IsAddressWhitelistedReturnType,
    options: {
      description: 'Is address whitelisted',
      name: getRouterName(RouterName.isAddressWhitelisted),
    },
  },
  listFiles: {
    return: () => [ListObjectsOutputType],
    options: {
      description: 'list files.',
      name: getRouterName(RouterName.listFiles),
    },
  },
  checkUserInCognito: {
    return: () => Boolean,
    options: {
      description: 'check user in dynamodb',
      name: getRouterName(RouterName.checkUserInCognito),
    },
  },
  checkKycAndEtheriumAddress: {
    return: () => Boolean,
    options: {
      description: 'check user\'s kyc and etherium is done or not.',
      name: getRouterName(RouterName.checkKycAndEtheriumAddress),
    },
  },
  getPpmOrOperatingDocAgreement: {
    return: () => PPMDcoumentType,
    options: {
      description: 'get ppm document agreement',
      name: getRouterName(RouterName.getPpmOrOperatingDocAgreement),
    },
  },
  getSubscriptionAgreement: {
    return: () => [SubscriptionAgreementType],
    options: {
      description: 'get subscription agreement by reid and userid',
      name: getRouterName(RouterName.getSubscriptionAgreement),
    },
  },
  getUserReffral: {
    return: () => UserReferralType,
    options: {
      description: descriptionOf[RouterName.getUserReferralInfo],
      name: getRouterName(RouterName.getUserReferralInfo),
    },
  },
  getWorkFlowRunId: {
    return: () => WorkFlowRunType,
    options: {
      description: descriptionOf[RouterName.getWorkFlowRunId],
      name: getRouterName(RouterName.getWorkFlowRunId),
    },
  },
  getAgreementDocLink: {
    return: () => AgreementDocumentLinkType,
    options: {
      description: descriptionOf[RouterName.getAgreementDocLink],
      name: getRouterName(RouterName.getAgreementDocLink),
    },
  },
  zilloDigital: {
    getDigitalRealEstate: {
      return: () => ZilloDigitalREDataType,
      options: {
        description: descriptionOf[RouterName.getDigitalRealEstate],
        name: getRouterName(RouterName.getDigitalRealEstate),
      },
    },
    listDigitalRealEstate: {
      return: () => ZilloDigitalREDataType,
      options: {
        description: descriptionOf[RouterName.listDigitalRealEstate],
        name: getRouterName(RouterName.listDigitalRealEstate),
      },
    },
    getChartDataByAddress: {
      return: () => ChartDataType,
      options: {
        description: descriptionOf[RouterName.getChartDataByAddress],
        name: getRouterName(RouterName.getChartDataByAddress),
      },
    },
    getZillowDataByAddress: {
      return: () => ZillowDataByAddressType,
      options: {
        description: descriptionOf[RouterName.getZillowDataByAddress],
        name: getRouterName(RouterName.getZillowDataByAddress),
      },
    },
    downloadImageToS3: {
      return: () => String,
      options: {
        description: descriptionOf[RouterName.downloadImageToS3],
        name: getRouterName(RouterName.downloadImageToS3),
      },
    },
    getAllCompanySocialsList: {
      return: () => [CompanyData],
      options: {
        description: descriptionOf[RouterName.getAllCompanySocialsList],
        name: getRouterName(RouterName.getAllCompanySocialsList),
      },
    },
    listContractAddrByCompany: {
      return: () => [CompanyContractData],
      options: {
        description: descriptionOf[RouterName.listContractAddrByCompany],
        name: getRouterName(RouterName.listContractAddrByCompany),
      },
    },
    getDigitalReCompany: {
      return: () => GetDigitalReCompanyType,
      options: {
        description: descriptionOf[RouterName.getDigitalReCompany],
        name: getRouterName(RouterName.getDigitalReCompany),
      },
    },
    getMarketCapitalisation: {
      return: () => GetMarketCapitalisation,
      options: {
        description: descriptionOf[RouterName.getMarketCapitalisation],
        name: getRouterName(RouterName.getMarketCapitalisation),
      },
    },
    companyUrlMapping: {
      return: () => JSONObject,
      options: {
        description:
          'Mapping or association between a company and its corresponding URL or website address',
        name: 'companyUrlMapping',
      },
    },
    getTraditionalInfo: {
      return: () => JSONObject,
      options: {
        desription: 'Get traditional info using reId and company name.',
        name: 'getTraditionalInfo',
      },
    },
    getDigitalDebt: {
      return: () => JSONObject,
      options: {
        desciption: 'get digital debt using company name and reID',
        name: 'getDigitalDebt',
      },
    },
    listDigitalDebt: {
      return: () => JSONObject,
      options: {
        desciption: 'list available all digital debt.',
        name: 'listDigitalDebt',
      },
    },
    listDigitalBonds: {
      return: () => JSONObject,
      options: {
        desciption: 'list available all digital bonds.',
        name: 'listDigitalBonds',
      },
    },
    listDigitalArts: {
      return: () => JSONObject,
      options: {
        desciption: 'list available all digital arts.',
        name: 'listDigitalArts',
      },
    },
    fetchHistoricalData: {
      return: () => HistoricalDataType,
      options: {
        desciption: 'fetch or list all available historical data',
        name: 'fetchHistoricalData',
      },
    },
    fetchHotListings: {
      return: () => HostListingsType,
      options: {
        description: 'fectch or list hotlisting',
        name: 'fetchHotListings',
      },
    },
  },
}
