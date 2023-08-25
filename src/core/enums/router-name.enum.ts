export enum RouterName {
  // mutation
  buyTokens,
  generateSdkToken,
  createChecks,
  uploadLivePhoto,
  uploadDocument,
  updateApplicant,
  createApplicant,
  fetchRealEstateBasicInfo,
  createRealEstateBasicInfo,
  createRealEstateFinance,
  deleteUser,
  updateUser,
  createUser,
  createStripePaymentIntent,
  cancelStripePaymentIntent,
  createInvoice,
  createCognitoUser,
  createUserInDynamo,
  updateCognitoUser,
  createOrder,
  createCoinifyPayment,
  submitWorkflowResponse,
  updateEthereumAddress,
  updateTokenTransfer,
  updatePpmOrOperatingDocAgreement,
  updateOperatingOrSubscriptionAgreement,
  createSubscriptionAgreement,
  createDigitalBonds,
  createDigitalArts,
  // query
  getDigitalRealEstate,
  user,
  users,
  healthzCheck,
  getApplicantById,
  listApplicants,
  retrieveDocument,
  listDocuments,
  retrieveLivePhoto,
  listLivePhotoes,
  retrieveChecks,
  listChecks,
  retrieveReports,
  listReports,
  getRealEstateFinanceByReId,
  getRealEstateBasicInfoById,
  getRealEstateInfoListByIds,
  getRealEstateInfoList,
  getRealEstateInfoById,
  getZillowDataByAddress,
  downloadImageToS3,
  getChartDataByAddress,
  listDigitalRealEstate,
  addressSanctioned,
  getUserAccess,
  loggedInUserAccess,
  getAccessToken,
  refreshSession,
  getWorkFlowRunId,
  listFiles,
  checkUserInCognito,
  checkKycAndEtheriumAddress,
  getPpmOrOperatingDocAgreement,
  getSubscriptionAgreement,
  getUserReferralInfo,
  tokenTransfer,
  whitelistAddresses,
  isAddressWhitelisted,
  mintingAddressAndSetUri,
  applyReferralCode,
  // restful API
  webhooks,
  constructWebhook,
  updateSmartContractAndAdditionalInfo,
  getAgreementDocLink,
  getAllCompanySocialsList,
  listContractAddrByCompany,
  createReCompany,
  getDigitalReCompany,
  getMarketCapitalisation,
  createDigitalDebt,
}

export const descriptionOf = {
  [RouterName.buyTokens]: 'buy tokens for perticular order',
  [RouterName.generateSdkToken]: 'generating the sdk token for onfido kyc',
  [RouterName.createChecks]: 'create the checks for to used in next call.',
  [RouterName.uploadLivePhoto]: 'upload live photo using onfido api',
  [RouterName.uploadDocument]: 'upload document for to check the identity proof.',
  [RouterName.updateApplicant]: 'update applicant.',
  [RouterName.createApplicant]: 'create the applicant client',
  [RouterName.fetchRealEstateBasicInfo]: 'fetch or retrive basic info of real estate.',
  [RouterName.createRealEstateBasicInfo]: 'create the realesate basic info.',
  [RouterName.createRealEstateFinance]:
    'create real-estate finance, passing reid and finance data.',
  [RouterName.deleteUser]: 'delete user from DB',
  [RouterName.updateUser]: 'Update a given user',
  [RouterName.createUser]: 'Request for creating of new user',
  [RouterName.createStripePaymentIntent]: 'create stripe payment initiate.',
  [RouterName.cancelStripePaymentIntent]: 'cancel stripe payment initiate.',
  [RouterName.createInvoice]: 'create invoice for the stripe payment.',
  [RouterName.createCognitoUser]: 'create cognito user',
  [RouterName.createUserInDynamo]: 'create cognito user in dynamodb at all',
  [RouterName.updateCognitoUser]: 'update cognito user in database',
  [RouterName.createOrder]: 'create the order',
  [RouterName.createCoinifyPayment]: 'create conify payment initiate',
  [RouterName.submitWorkflowResponse]: 'submit workflow response',
  [RouterName.updateEthereumAddress]: 'update ethereum address',
  [RouterName.updateTokenTransfer]: 'update token transfer in dynamodb',
  [RouterName.updatePpmOrOperatingDocAgreement]:
    'update ppm or operating agreement document.',
  [RouterName.updateOperatingOrSubscriptionAgreement]:
    'update operating or subscriipton agreement.',
  [RouterName.createSubscriptionAgreement]: 'create subscription agreement.',
  [RouterName.createReCompany]: 'create the company details from the inputs',
  [RouterName.createDigitalDebt]: 'create debt for the digital assest',
  [RouterName.createDigitalBonds]: 'create bonds for the digital assest.',
  [RouterName.createDigitalArts]: 'create arts for the digital arts',
  // query
  [RouterName.getMarketCapitalisation]: 'get market capitalisation',
  [RouterName.user]: 'get user from DB',
  [RouterName.users]: 'get users from DB',
  [RouterName.healthzCheck]: 'check health of application.',
  [RouterName.getApplicantById]: 'get applicant by applicant Id',
  [RouterName.listApplicants]:
    'This API retrieves a list of applicants. It may be used to retrieve information about individuals or entities who have submitted applications.',
  [RouterName.retrieveDocument]:
    'This API is used to retrieve a specific document. It allows you to fetch the content or details of a particular document.',
  [RouterName.listDocuments]:
    'This API provides a list of documents. It allows you to retrieve information about multiple documents, such as their names, types, or metadata.',
  [RouterName.retrieveLivePhoto]:
    'This API retrieves a live photo. Live photos typically consist of a combination of images and videos, and this API allows you to retrieve such media content.',
  [RouterName.listLivePhotoes]:
    ' This API retrieves a list of live photos. It provides information about multiple live photos, such as their names, sizes, or timestamps.',
  [RouterName.retrieveChecks]:
    'This API is used to retrieve specific checks. It allows you to fetch details or results of checks performed on certain criteria or conditions.',
  [RouterName.listChecks]:
    'This API provides a list of checks. It allows you to retrieve information about multiple checks, such as their statuses, types, or timestamps.',
  [RouterName.retrieveReports]:
    'This API retrieves specific reports. It allows you to fetch details or results of generated reports.',
  [RouterName.listReports]:
    'This API provides a list of reports. It allows you to retrieve information about multiple reports, such as their names, types, or timestamps.',
  [RouterName.getRealEstateFinanceByReId]:
    'This API retrieves real estate finance information based on a specific real estate ID (referred to as "ReId"). It provides details about the financial aspects related to the identified real estate property.',
  [RouterName.getRealEstateBasicInfoById]:
    'This API retrieves basic information about a real estate property based on its ID. It may include details such as the property\'s address, size, or basic attributes.',
  [RouterName.getRealEstateInfoListByIds]:
    'This API retrieves a list of real estate information based on a set of specified IDs. It allows you to retrieve information about multiple real estate properties using their unique identifiers.',
  [RouterName.getRealEstateInfoList]:
    'This API provides a list of real estate information. It allows you to retrieve information about multiple real estate properties, such as their addresses, sizes, or other relevant details.',
  [RouterName.getRealEstateInfoById]:
    'This API retrieves detailed information about a specific real estate property based on its ID. It may provide comprehensive details about the property\'s characteristics, ownership, or historical data.',
  [RouterName.addressSanctioned]:
    'This API checks whether an address is sanctioned or subject to any restrictions. It helps verify if an address is associated with any legal or regulatory limitations.',
  [RouterName.getUserAccess]:
    'This API retrieves access information for a user. It allows you to determine the level of access or permissions granted to a particular user within the system or application.',
  [RouterName.loggedInUserAccess]:
    'This API retrieves access information for the currently logged-in user. It provides details about the permissions and privileges assigned to the user currently using the system.',
  [RouterName.getAccessToken]:
    'This API is used to obtain an access token. Access tokens are typically used for authentication or authorization purposes to access protected resources within a system or application.',
  [RouterName.refreshSession]:
    'This API is used to refresh a user\'s session.It allows users to extend their session validity or renew their authentication status without re- authenticating.',
  [RouterName.listFiles]:
    ' This API retrieves a list of files. It allows you to fetch information about multiple files, such as their names, sizes, or timestamps. This can be useful for managing and accessing files within a system or application.',
  [RouterName.checkUserInCognito]:
    'This API checks whether a user is in incognito mode or using private browsing. It helps determine if the user\'s browsing session is configured to hide their browsing history or data.',
  [RouterName.checkKycAndEtheriumAddress]:
    'This API verifies the Know Your Customer (KYC) information and Ethereum address. It allows you to validate and authenticate the provided KYC data and Ethereum wallet address for user identification or verification purposes.',
  [RouterName.getPpmOrOperatingDocAgreement]:
    'This API retrieves the Private Placement Memorandum (PPM) or Operating Document Agreement. It allows you to obtain the legally binding documentation related to private placements or operating agreements for investment or business purposes.',
  [RouterName.getSubscriptionAgreement]:
    'This API retrieves the subscription agreement. It provides access to the agreement document that outlines the terms and conditions for subscribing to a service, product, or membership.',
  [RouterName.tokenTransfer]:
    'This API enables the transfer of tokens. It allows you to initiate the transfer of digital tokens or cryptocurrencies between different addresses or accounts within a blockchain network.',
  [RouterName.whitelistAddresses]:
    'This API manages the whitelist of addresses. It provides functionality to add or remove addresses from a whitelist, which typically represents a trusted or authorized list of addresses within a system or application.',
  [RouterName.isAddressWhitelisted]:
    ' This API checks whether an address is whitelisted. It allows you to verify if a specific address is included in the whitelist, indicating that it has been granted special permissions or access privileges.',
  // restful API
  [RouterName.webhooks]: 'get all the webhooks.',
  [RouterName.updateSmartContractAndAdditionalInfo]:
    'updating smart contract and additional information.',
  [RouterName.getUserReferralInfo]: 'get user\'s refral details.',
  [RouterName.getWorkFlowRunId]: 'get workflow run id from onfido orchastration.',
  [RouterName.getAgreementDocLink]: 'get agreement document link from s3 bucket.',
  [RouterName.getZillowDataByAddress]: 'get digital real estate zillow by address',
  [RouterName.getChartDataByAddress]: 'get chart data by address',
  [RouterName.downloadImageToS3]: 'download image from url to s3 bucket.',
  [RouterName.listDigitalRealEstate]: 'fetch all digital real estate',
  [RouterName.getAllCompanySocialsList]: 'get all Re-Companies urls and socials links',
  [RouterName.listContractAddrByCompany]: 'List contract address by the company',
  [RouterName.getDigitalReCompany]: 'get RealEsate company details by company name',
  [RouterName.getDigitalRealEstate]:
    'get digital (phase2)real estate by company name and reid',
}

export const getRouterName = (input: RouterName) => {
  return RouterName[input]
}
