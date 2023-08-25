// All Typename must be end with 'Type'
// for e.g: (type)Type

export enum TypeName {
  Aggregate = 'Aggregate',
  PageInfo = 'PageInfo',
  UserEdge = 'UserEdge',
  UserConnection = 'UserConnection',
  TokenType = 'TokenType',
  TokenResponseType = 'TokenResponseType',
  Address = 'Address',
  // Seller
  UserType = 'UserType',
  UserResponse = 'UserResponse',
  CreateCognitoUserType = 'CreateCognitoUserType',
  GetCognitoUserType = 'GetCognitoUserType',
  UpdateCognitoUserType = 'UpdateCognitoUserType',
  ChangeRoleType = 'ChangeRoleType',
  ApplyReffralCode = 'ApplyReffralCode',
  updateEthereumAddressType = 'updateEthereumAddressType',
  UserAttr = 'UserAttr',
  UserRolePermission = 'UserRolePermission',
  UserPermission = 'UserPermission',
  // Realestate
  RealEstateFinanceType = 'RealEstateFinanceType',
  RealEstateBasicInfo = 'RealEstateBasicInfo',
  MemoryHealthIndicator = 'MemoryHealthIndicator',
  MemoryHealthIndicatorTypeDetails = 'MemoryHealthIndicatorTypeDetails',
  Status = 'Status',
  // Property
  RealEstateListingType = 'RealEstateListingType',
  RealEstateAndFinanceType = 'RealEstateAndFinanceType',
  AddressType = 'AddressType',
  DeedType = 'DeedType',
  OwnerType = 'OwnerType',
  MarketAssessmentType = 'MarketAssessmentType',
  AssessmentType = 'AssessmentType',
  TaxType = 'TaxType',
  ValuationType = 'ValuationType',
  OtherAreaType = 'OtherAreaType',
  OtherFeaturesType = 'OtherFeaturesType',
  OtherImprovementsType = 'OtherImprovementsType',
  StructureType = 'StructureType',
  GeojsonType = 'GeojsonType',
  BoundaryType = 'BoundaryType',
  ParcelType = 'ParcelType',
  NoPropertyFoundType = 'NoPropertyFoundType',
  MetadataType = 'MetadataType',
  RealEstateBasicInfoType = 'RealEstateBasicInfoType',
  CommonType = 'CommonType',
  // ReFullListingFinanceType = 'ReFullListingFinanceType',
  NoPropertyFoundTypeTemp = 'NoPropertyFoundTypeTemp',
  UpdateSmartContractAndAdditionalInfoType = 'UpdateSmartContractAndAdditionalInfoType',
  // s3 single upload
  UploadedType = 'UploadedType11',
  // s3 bucket/uploads
  DeleteFilesType = 'DeleteFilesType',
  DeleteFileObject = 'DeleteFileObject',
  DeleteFileError = 'DeleteFileError',
  // s3 bucket/listfiles
  ListFileCommonPrefix = 'ListFileCommonPrefix',
  ListFileOwner = 'ListFileOwner',
  ListFileObject = 'ListFileObject',
  ListObjectsOutputType = 'ListObjectsOutputType',
  // s3 presigned url
  PreSignedUrlType = 'PreSignedUrlType',
  AgreementDocumentLinkType = 'AgreementDocumentLinkType',
  // onfido
  ApplicantType = 'ApplicantType',
  AddressOptional = 'AddressOptional',
  ApplicatanAddress = 'ApplicatanAddress',
  IdNumber = 'IdNumber',
  UploadDocumentType = 'UploadDocumentType',
  DownloadDocumentType = 'DownloadDocumentType',
  LivePhotoType = 'LivePhotoType',
  ChecksType = 'ChecksType',
  ReportsType = 'ReportsType',
  GenerateTokenType = 'GenerateTokenType',
  WebhookEventType = 'WebhookEventType',
  OnfidoWebhookEventType = 'OnfidoWebhookEventType',
  WorkFlowRunType = 'WorkFlowRunType',
  // stripe
  PaymentIntentType = 'PaymentIntentType',
  SubmitWorkflowResponseType = 'SubmitWorkflowResponseType',

  // chainalysis
  AddressSanctionedType = 'AddressSanctionedType',
  SanctionedFieldType = 'SanctionedFieldType',

  // checkout
  OrderType = 'OrderType',
  BuyTokesType = 'BuyTokensType',
  UpdateAgreementType = 'UpdateAgreementType',
  SubscriptionAgreementType = 'SubscriptionAgreementType',

  // coinify
  PaymentType = 'PaymentType',
  BitCoinType = 'BitCoinType',
  CustomType = 'CustomType',
  TransferType = 'TransferType',
  NativeType = 'NativeType',
  PaymentDataType = 'PaymentDataType',
  // tokenTransfer
  TransferDataType = 'TransferDataType',
  WhitelistAddressesType = 'WhitelistAddressesType',
  IsAddressWhitelistedReturnType = 'isAddressWhitelistedReturnType',
  PPMDcoumentType = 'PPMDocumentType',
  UserReferralType = 'UserReferralType',
}
