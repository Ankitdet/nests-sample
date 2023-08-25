declare namespace ZillowReNameSpace {
  export interface Address {
    city: string
    community?: any
    neighborhood: string
    state: string
    streetAddress: string
    subdivision?: any
    zipcode: string
  }

  export interface ApartmentsForRentInZipcodeSearchUrl {
    path: string
  }

  export interface InfoList1 {
    infoField1: string
    infoField2?: any
  }

  export interface ListingOffice {
    associatedOfficeType: string
    officeName?: any
  }

  export interface AttributionInfo {
    agentEmail?: any
    agentLicenseNumber?: any
    agentName?: any
    agentPhoneNumber?: any
    attributionTitle?: any
    brokerName?: any
    brokerPhoneNumber?: any
    buyerAgentMemberStateLicense?: any
    buyerAgentName?: any
    buyerBrokerageName?: any
    coAgentLicenseNumber?: any
    coAgentName?: any
    coAgentNumber?: any
    infoList1: InfoList1[]
    infoList2: any[]
    infoString1?: any
    infoString10?: any
    infoString11?: any
    infoString12?: any
    infoString13?: any
    infoString14?: any
    infoString15?: any
    infoString16?: any
    infoString17?: any
    infoString18?: any
    infoString19?: any
    infoString2?: any
    infoString20?: any
    infoString3?: any
    infoString4?: any
    infoString5?: any
    infoString6?: any
    infoString7?: any
    infoString9?: any
    lastChecked?: any
    lastUpdated?: any
    listingAgents: any[]
    listingAgreement?: any
    listingOffices: ListingOffice[]
    mlsDisclaimer?: any
    mlsId?: any
    mlsName?: any
    providerLogo?: any
    trueStatus?: any
  }

  export interface Big {
    subjectType?: any
    url: string
    width: number
  }

  export interface CitySearchUrl {
    path: string
    text: string
  }

  export interface DownPaymentAssistance {
    maxAssistance?: any
    resultCount: number
  }

  export interface ForeclosureTypes {
    isAnyForeclosure: boolean
    isBankOwned: boolean
    isForeclosedNFS: boolean
    isPreforeclosure: boolean
    wasDefault?: any
    wasForeclosed: boolean
    wasNonRetailAuction: boolean
    wasREO?: any
  }

  export interface Location {
    fullValue: string
  }

  export interface FormattedChip {
    location: Location[]
  }

  export interface HomeRecommendations {
    blendedRecs: any[]
    displayShort: string
  }

  export interface HousesForRentInZipcodeSearchUrl {
    path: string
  }

  export interface HugePhoto {
    caption: string
    height: number
    url: string
    width: number
  }

  export interface ListingMetadata {
    FlexibleLayoutAA: boolean
    FlexibleLayoutAB: boolean
    FlexibleLayoutB: boolean
    FlexibleLayoutC: boolean
    FlexibleLayoutD: boolean
    FlexibleLayoutE: boolean
    FlexibleLayoutF: boolean
    FlexibleLayoutG: boolean
    FlexibleLayoutH: boolean
    FlexibleLayoutI: boolean
    FlexibleLayoutJ: boolean
    FlexibleLayoutK: boolean
    FlexibleLayoutL: boolean
    FlexibleLayoutM: boolean
    FlexibleLayoutN: boolean
    FlexibleLayoutO: boolean
    FlexibleLayoutP: boolean
    FlexibleLayoutQ: boolean
    FlexibleLayoutR: boolean
    FlexibleLayoutS: boolean
    FlexibleLayoutT: boolean
    FlexibleLayoutU: boolean
    FlexibleLayoutV: boolean
    FlexibleLayoutW: boolean
    FlexibleLayoutX: boolean
    FlexibleLayoutY: boolean
    FlexibleLayoutZ: boolean
    canCommingleComparables: boolean
    canShowAutomatedValuationDisplay: boolean
    canShowComparables: boolean
    canShowCroppedPhotos: boolean
    canShowNonIDXMedia: boolean
    canShowOnMap: boolean
    canShowPrequalifiedLinkInChip: boolean
    canShowPriceHistory: boolean
    canShowTaxHistory: boolean
    canShowUserGeneratedContent: boolean
    canShowZillowLogoInHeader: boolean
    comminglingCategory: boolean
    comminglingCategoryIsRulesApplicable: boolean
    hidePriceAdjustmentFlexField: boolean
    isAdsRestricted: boolean
    isSuperTrafficOptimized: boolean
    mustAttributeOfficeNameBeforeAgentName: boolean
    mustDisplayAttributionListAgentEmail: boolean
    mustDisplayAttributionListAgentPhone: boolean
    mustDisplayAttributionListingOfficePhone: boolean
    mustDisplayDisclaimerBelowAttribution: boolean
    mustDisplayFeedLogoInContactBox: boolean
    mustHighlightAgentName?: any
    mustHighlightListOfficeName: boolean
    mustHighlightMarketingType: boolean
    mustHighlightMlsId?: any
    mustHighlightMlsStatus: boolean
    mustMakeListingAgentContactable: boolean
    passwordRequiredForZestimateMarketAnalysis: boolean
  }

  export interface ListingProvider {
    agentLicenseNumber?: any
    agentName?: any
    disclaimerText?: any
    enhancedDescriptionText?: any
    enhancedVideoURL?: any
    isZRMSourceText?: any
    logos: any[]
    postingGroupName?: any
    postingWebsiteLinkText: string
    postingWebsiteURL?: any
    showLogos?: any
    showNoContactInfoMessage: boolean
    sourceText?: any
    title: string
  }

  export interface ListingSubType {
    isBankOwned: boolean
    isComingSoon: boolean
    isFSBA: boolean
    isFSBO: boolean
    isForAuction: boolean
    isForeclosure: boolean
    isNewHome: boolean
    isOpenHouse: boolean
    isPending: boolean
  }

  export interface ListingSubType2 {
    is_FSBA: boolean
    is_FSBO: boolean
    is_bankOwned: boolean
    is_comingSoon: boolean
    is_forAuction: boolean
    is_foreclosure: boolean
    is_newHome: boolean
    is_openHouse: boolean
    is_pending: boolean
  }

  export interface MortgageRates {
    arm5Rate: number
    fifteenYearFixedRate: number
    thirtyYearFixedRate: number
  }

  export interface RegionUrl {
    path: string
  }

  export interface NearbyCity {
    body?: any
    name: string
    regionUrl: RegionUrl
  }

  export interface Address2 {
    city: string
    state: string
    streetAddress: string
    zipcode: string
  }

  export interface AttributionInfo2 {
    agentName?: any
    agentPhoneNumber?: any
    brokerName?: any
    brokerPhoneNumber?: any
    mlsId: string
    mlsName?: any
    providerLogo?: any
    trueStatus?: any
  }

  export interface ListingSubType3 {
    is_FSBA: boolean
    is_FSBO: boolean
    is_bankOwned: boolean
    is_comingSoon: boolean
    is_forAuction: boolean
    is_foreclosure: boolean
    is_newHome: boolean
  }

  export interface MiniCardPhoto {
    url: string
  }

  export interface NearbyHome {
    address: Address2
    attributionInfo: AttributionInfo2
    bathrooms?: number
    bedrooms?: number
    currency: string
    hdpUrl: string
    homeStatus: string
    homeType: string
    isPremierBuilder: boolean
    isZillowOwned: boolean
    latitude: number
    listing_sub_type: ListingSubType3
    livingArea: number
    livingAreaUnits: string
    livingAreaUnitsShort: string
    livingAreaValue: number
    longitude: number
    lotAreaUnits: string
    lotAreaValue?: number
    lotSize?: number
    miniCardPhotos: MiniCardPhoto[]
    newConstructionType?: any
    price: number
    providerListingID?: any
    state: string
    zpid: number
  }

  export interface RegionUrl2 {
    path: string
  }

  export interface NearbyNeighborhood {
    body?: any
    name: string
    regionUrl: RegionUrl2
  }

  export interface RegionUrl3 {
    path: string
  }

  export interface NearbyZipcode {
    body?: any
    name: string
    regionUrl: RegionUrl3
  }

  export interface NeighborhoodRegion {
    name: string
  }

  export interface NeighborhoodSearchUrl {
    path: string
  }

  export interface DecisionContext {}

  export interface DecisionContext2 {
    city: string
    countyId: string
    displayCategory: string
    guid: string
    hasUserClaimedHome: boolean
    homeStatus: string
    homeType: string
    isAdsRestricted: boolean
    isZillowOwned: boolean
    leadType: string
    leadTypes: string[]
    listPrice: number
    placementId: string
    shouldDisplayUpsell: boolean
    state: string
    stateId: string
    streetAddress: string
    surfaceId: string
    zipcode: string
    zoMarketCode: string
  }

  export interface QualifiedTreatment {
    id: number
    lastModified: string
    name: string
    status: string
  }

  export interface SelectedTreatment {
    component: string
    id: number
    lastModified: string
    name: string
    renderingProps: string
    status: string
  }

  export interface Message {
    bucket: string
    decisionContext: DecisionContext2
    eventId: string
    isGlobalHoldout: boolean
    lastModified: string
    passThrottle: boolean
    placementId: number
    placementName: string
    qualifiedTreatments: QualifiedTreatment[]
    selectedTreatment: SelectedTreatment
    shouldDisplay: boolean
    skipDisplayReason?: any
    testPhase: string
  }

  export interface OnsiteMessage {
    decisionContext: DecisionContext
    eventId: string
    messages: Message[]
  }

  export interface ParentRegion {
    name: string
  }

  export interface Jpeg {
    url: string
    width: number
  }

  export interface Webp {
    url: string
    width: number
  }

  export interface MixedSources {
    webp: Webp[]
  }

  export interface Photo {
    caption: string
    mixedSources: MixedSources
  }

  export interface PostingContact {
    name?: any
    photo?: any
  }

  export interface AttributeSource {
    infoString1: string
    infoString2: string
    infoString3: string
  }

  export interface Photo2 {
    url: string
  }

  export interface BuyerAgent {
    name: string
    photo: Photo2
    profileUrl: string
  }

  export interface Photo3 {
    url: string
  }

  export interface SellerAgent {
    name: string
    photo: Photo3
    profileUrl: string
  }

  export interface PriceHistory {
    attributeSource: AttributeSource
    buyerAgent: BuyerAgent
    date: string
    event: string
    postingIsRental: boolean
    price: number
    priceChangeRate: number
    pricePerSquareFoot: number
    sellerAgent: SellerAgent
    showCountyLink: boolean
    source: string
    time: any
  }

  export interface AtAGlanceFact {
    factLabel: string
    factValue: string
  }

  export interface Room {
    area?: any
    description?: any
    dimensions?: any
    features?: any
    length?: any
    level?: any
    roomArea?: any
    roomAreaSource?: any
    roomAreaUnits?: any
    roomDescription?: any
    roomDimensions?: any
    roomFeatures?: any
    roomLength?: any
    roomLengthWidthSource?: any
    roomLengthWidthUnits?: any
    roomLevel?: any
    roomType: string
    roomWidth?: any
    width?: any
  }

  export interface ResoFacts {
    aboveGradeFinishedArea?: any
    accessibilityFeatures?: any
    additionalParcelsDescription?: any
    allowedPets?: any
    appliances: any[]
    architecturalStyle?: any
    associationAmenities?: any
    associationFee?: any
    associationFee2?: any
    associationFeeIncludes?: any
    associationName?: any
    associationName2?: any
    associationPhone?: any
    associationPhone2?: any
    atAGlanceFacts: AtAGlanceFact[]
    attic?: any
    availabilityDate?: any
    basement: string
    basementYN: boolean
    bathrooms: number
    bathroomsFull?: any
    bathroomsHalf?: any
    bathroomsOneQuarter?: any
    bathroomsPartial?: any
    bathroomsThreeQuarter?: any
    bedrooms: number
    belowGradeFinishedArea?: any
    bodyType?: any
    builderModel?: any
    builderName?: any
    buildingArea?: any
    buildingAreaSource?: any
    buildingFeatures?: any
    buildingName?: any
    buyerAgencyCompensation?: any
    buyerAgencyCompensationType?: any
    canRaiseHorses: boolean
    carportSpaces?: any
    cityRegion: string
    commonWalls?: any
    communityFeatures: any[]
    constructionMaterials: any[]
    cooling: any[]
    coveredSpaces?: any
    cropsIncludedYN?: any
    daysOnZillow: number
    depositsAndFees?: any
    developmentStatus?: any
    doorFeatures?: any
    electric?: any
    elementarySchool: string
    elementarySchoolDistrict: string
    elevation?: any
    elevationUnits?: any
    entryLevel?: any
    entryLocation?: any
    exclusions?: any
    exteriorFeatures: any[]
    fencing?: any
    fireplaceFeatures?: any
    fireplaces?: any
    flooring: any[]
    foundationArea?: any
    foundationDetails: any[]
    frontageLength?: any
    frontageType?: any
    furnished: boolean
    garageSpaces?: any
    gas?: any
    greenBuildingVerificationType?: any
    greenEnergyEfficient?: any
    greenIndoorAirQuality?: any
    greenSustainability?: any
    greenWaterConservation?: any
    hasAdditionalParcels: boolean
    hasAssociation?: any
    hasAttachedGarage?: any
    hasAttachedProperty: boolean
    hasCarport?: any
    hasCooling: boolean
    hasElectricOnProperty?: any
    hasFireplace: boolean
    hasGarage: boolean
    hasHeating: boolean
    hasHomeWarranty: boolean
    hasLandLease: boolean
    hasOpenParking?: any
    hasPetsAllowed?: any
    hasPrivatePool?: any
    hasRentControl?: any
    hasSpa: boolean
    hasView: boolean
    hasWaterfrontView?: any
    heating: string[]
    highSchool?: any
    highSchoolDistrict: string
    hoaFee?: any
    homeType: string
    horseAmenities?: any
    horseYN?: any
    inclusions?: any
    incomeIncludes?: any
    interiorFeatures?: any
    irrigationWaterRightsAcres?: any
    irrigationWaterRightsYN?: any
    isNewConstruction?: any
    isSeniorCommunity?: any
    landLeaseAmount?: any
    landLeaseExpirationDate?: any
    laundryFeatures?: any
    leaseTerm?: any
    levels?: any
    listAOR?: any
    listingId?: any
    listingTerms?: any
    livingArea: string
    livingAreaRange?: any
    livingAreaRangeUnits?: any
    lotFeatures?: any
    lotSize: string
    lotSizeDimensions?: any
    mainLevelBathrooms?: any
    mainLevelBedrooms?: any
    marketingType?: any
    middleOrJuniorSchool: string
    middleOrJuniorSchoolDistrict: string
    municipality?: any
    numberOfUnitsInCommunity?: any
    numberOfUnitsVacant?: any
    offerReviewDate?: any
    onMarketDate?: any
    openParkingSpaces?: any
    otherEquipment?: any
    otherFacts: any[]
    otherParking?: any
    otherStructures?: any
    ownership?: any
    ownershipType?: any
    parcelNumber: string
    parking: number
    parkingFeatures: string[]
    patioAndPorchFeatures?: any
    petsMaxWeight?: any
    poolFeatures?: any
    pricePerSquareFoot: number
    propertyCondition?: any
    propertySubType?: any
    roadSurfaceType?: any
    roofType: string
    rooms: Room[]
    securityFeatures?: any
    sewer?: any
    spaFeatures?: any
    specialListingConditions?: any
    stories?: any
    storiesTotal?: any
    structureType?: any
    subdivisionName?: any
    taxAnnualAmount: number
    tenantPays?: any
    topography?: any
    totalActualRent?: any
    utilities?: any
    vegetation?: any
    view: string[]
    virtualTour?: any
    virtualTourURLUnbranded?: any
    waterBodyName?: any
    waterSource?: any
    waterSources?: any
    waterView: string
    waterViewYN: boolean
    waterfrontFeatures?: any
    windowFeatures?: any
    woodedArea?: any
    yearBuilt: number
    yearBuiltEffective?: any
    zoning?: any
    zoningDescription?: any
  }

  export interface Jpeg2 {
    url: string
    width: number
  }

  export interface Webp2 {
    url: string
    width: number
  }

  export interface MixedSources2 {
    jpeg: Jpeg2[]
    webp: Webp2[]
  }

  export interface ResponsivePhoto {
    caption: string
    mixedSources: MixedSources2
    subjectType?: any
    url: string
  }

  export interface Jpeg3 {
    url: string
    width: number
  }

  export interface Webp3 {
    url: string
    width: number
  }

  export interface MixedSources3 {
    jpeg: Jpeg3[]
    webp: Webp3[]
  }

  export interface ResponsivePhotosOriginalRatio {
    caption: string
    mixedSources: MixedSources3
  }

  export interface School {
    assigned?: any
    distance: number
    grades: string
    isAssigned: boolean
    level: string
    link: string
    name: string
    rating: number
    size: number
    studentsPerTeacher: number
    totalCount: number
    type: string
  }

  export interface SolarPotential {
    buildFactor: number
    climateFactor: number
    electricityFactor: number
    solarFactor: number
    sunScore: number
  }

  export interface StateSearchUrl {
    path: string
  }

  export interface Source {
    url: string
    width: number
  }

  export interface StaticMap {
    sources: Source[]
  }

  export interface AddressSource {
    url: string
    width: number
  }

  export interface LatLongSource {
    url: string
    width: number
  }

  export interface StreetView {
    addressSources: AddressSource[]
    latLongSources: LatLongSource[]
  }

  export interface TaxHistory {
    taxIncreaseRate: number
    taxPaid?: number
    time: any
    value: number
    valueIncreaseRate: number
  }

  export interface ThirdPartyVirtualTour {
    approved: boolean
    externalUrl?: any
    lightboxUrl?: any
    providerKey?: any
    providerName?: any
    staticUrl?: any
  }

  export interface Thumb {
    url: string
  }

  export interface Core {
    js: string
  }

  export interface Advertise {
    href: string
    text: string
  }

  export interface Home {
    href: string
    text: string
  }

  export interface Login {
    href: string
    text: string
  }

  export interface Register {
    href: string
    text: string
  }

  export interface Common {
    advertise: Advertise
    home: Home
    login: Login
    register: Register
  }

  export interface Link {
    href: string
    text: string
  }

  export interface Section {
    link: Link
  }

  export interface Help {
    sections: Section[]
  }

  export interface Logo {
    href: string
    text: string
  }

  export interface Link2 {
    classString: string
    href: string
    text: string
  }

  export interface Subsection {
    links: any[]
    title: string
  }

  export interface GaExpandoClickObj {
    action: string
    category: string
    label: string
  }

  export interface GaHoverEventObj {
    action: string
    category: string
    label: string
  }

  export interface Section2 {
    link: Link2
    subsections: Subsection[]
    gaExpandoClickObj: GaExpandoClickObj
    gaHoverEventObj: GaHoverEventObj
  }

  export interface Main {
    sections: Section2[]
  }

  export interface GaExpandoClickObj2 {
    action: string
    category: string
    label: string
  }

  export interface GaHoverEventObj2 {
    action: string
    category: string
    label: string
  }

  export interface Link3 {
    classString: string
    href: string
    text: string
  }

  export interface Subsection2 {
    links: any[][]
    title: string
  }

  export interface Section3 {
    classString: string
    gaExpandoClickObj: GaExpandoClickObj2
    gaHoverEventObj: GaHoverEventObj2
    id: string
    link: Link3
    subsections: Subsection2[]
  }

  export interface Marketing {
    sections: Section3[]
  }

  export interface Link4 {
    href: string
    text: string
  }

  export interface Section4 {
    link: Link4
  }

  export interface RegLogin {
    sections: Section4[]
  }

  export interface Json {
    agent: boolean
    common: Common
    help: Help
    logo: Logo
    main: Main
    marketing: Marketing
    regLogin: RegLogin
  }

  export interface Topnav {
    json: Json
  }

  export interface TopNavJson {
    core: Core
    topnav: Topnav
  }

  export interface TourEligibility {
    isPropertyTourEligible: boolean
  }

  export interface TourPhoto {
    url: string
  }

  export interface VrModel {
    cdnHost?: any
    revisionId?: any
    vrModelGuid?: any
  }

  export interface ZestimateDeepDiveData {
    zmaModel?: any
  }

  export interface ZillowOfferMarket {
    code?: any
  }

  export interface ZipcodeSearchUrl {
    path: string
  }

  export interface ZillowDigital {
    abbreviatedAddress: string
    address?: Address
    apartmentsForRentInZipcodeSearchUrl: ApartmentsForRentInZipcodeSearchUrl
    attributionInfo: AttributionInfo
    bathrooms: number
    bedrooms: number
    big: Big[]
    boroughId?: any
    boroughSearchUrl?: any
    brokerId?: any
    brokerIdDimension: string
    brokerageName?: any
    building?: any
    buildingId?: any
    city: string
    cityId: number
    citySearchUrl: CitySearchUrl
    comingSoonOnMarketDate?: any
    communityUrl?: any
    comps: any[]
    contingentListingType?: any
    country: string
    county: string
    countyFIPS: string
    countyId: number
    currency: string
    datePostedString: string
    datePriceChanged?: any
    dateSold: number
    dateSoldString: string
    daysOnZillow: number
    description: string
    desktopWebHdpImageLink: string
    downPaymentAssistance: DownPaymentAssistance
    editPropertyHistorylink?: any
    enhancedBrokerImageUrl?: any
    favoriteCount: number
    featuredListingTypeDimension: string
    floorMaps: any[]
    foreclosingBank?: any
    foreclosureAmount?: any
    foreclosureAuctionCity?: any
    foreclosureAuctionDescription?: any
    foreclosureAuctionFilingDate?: any
    foreclosureAuctionLocation?: any
    foreclosureAuctionTime?: any
    foreclosureBalanceReportingDate?: any
    foreclosureDate?: any
    foreclosureDefaultFilingDate?: any
    foreclosureJudicialType: string
    foreclosureLoanAmount?: any
    foreclosureLoanDate?: any
    foreclosureLoanOriginator?: any
    foreclosureMoreInfo?: any
    foreclosurePastDueBalance?: any
    foreclosurePriorSaleAmount?: any
    foreclosurePriorSaleDate?: any
    foreclosureTypes: ForeclosureTypes
    foreclosureUnpaidBalance?: any
    formattedChip: FormattedChip
    hasApprovedThirdPartyVirtualTourUrl: boolean
    hasBadGeocode: boolean
    hasPublicVideo: boolean
    hasVRModel?: any
    hdpTypeDimension: string
    hdpUrl: string
    hiResImageLink: string
    hideZMA: boolean
    hideZestimate: boolean
    homeInsights?: any
    homeRecommendations: HomeRecommendations
    homeStatus: string
    homeType: string
    homeValues?: any
    housesForRentInZipcodeSearchUrl: HousesForRentInZipcodeSearchUrl
    hugePhotos: HugePhoto[]
    isCamo?: any
    isCommunityPillar?: any
    isCurrentSignedInAgentResponsible: boolean
    isCurrentSignedInUserVerifiedOwner: boolean
    isFeatured: boolean
    isIncomeRestricted?: any
    isListedByOwner: boolean
    isListingClaimedByCurrentSignedInUser: boolean
    isNonOwnerOccupied: boolean
    isPaidMultiFamilyBrokerId: boolean
    isPreforeclosureAuction: boolean
    isPremierBuilder: boolean
    isRecentStatusChange: boolean
    isRentalListingOffMarket: boolean
    isRentalsLeadCapMet: boolean
    isUndisclosedAddress: boolean
    isZillowOwned: boolean
    keystoneHomeStatus: string
    lastSoldPrice: number
    latitude: number
    listPriceLow?: any
    listingAccountUserId?: any
    listingDataSource: string
    listingFeedID?: any
    listingMetadata: ListingMetadata
    listingProvider: ListingProvider
    listingSubType: ListingSubType
    listingTypeDimension: string
    listing_agent?: any
    listing_sub_type: ListingSubType2
    livingArea: number
    livingAreaUnits: string
    livingAreaUnitsShort: string
    livingAreaValue: number
    longitude: number
    lotAreaUnits: string
    lotAreaValue: number
    lotSize: number
    mapTileGoogleMapUrlFullWidthLightbox: string
    mapTileGoogleMapUrlFullWidthLightboxWholeZipcode: string
    mapTileGoogleMapUrlFullWidthMax: string
    mapTileGoogleMapUrlFullWidthMaxWholeZipcode: string
    mapTileGoogleMapUrlSmall: string
    mapTileGoogleMapUrlSmallWholeZipcode: string
    marketingName?: any
    mediumImageLink: string
    mlsid?: any
    monthlyHoaFee?: any
    mortgageRates: MortgageRates
    moveHomeMapLocationLink?: any
    moveInCompletionDate?: any
    moveInReady: boolean
    nearbyCities: NearbyCity[]
    nearbyHomes: NearbyHome[]
    nearbyNeighborhoods: NearbyNeighborhood[]
    nearbyZipcodes: NearbyZipcode[]
    neighborhoodRegion: NeighborhoodRegion
    neighborhoodSearchUrl: NeighborhoodSearchUrl
    newConstructionType?: any
    onsiteMessage: OnsiteMessage
    openHouseSchedule: any[]
    pageUrlFragment: string
    pageViewCount: number
    pals: any[]
    parcelId: string
    parentRegion: ParentRegion
    photoCount: number
    photos: Photo[]
    postingContact: PostingContact
    postingProductType: string
    postingUrl?: any
    price: number
    priceChange?: any
    priceChangeDate?: any
    priceChangeDateString?: any
    priceHistory: PriceHistory[]
    primaryPublicVideo?: any
    propertyEventLogLink?: any
    propertyTaxRate: number
    propertyTypeDimension: string
    propertyUpdatePageLink?: any
    providerListingID?: any
    regionString: string
    rentZestimate: number
    rentalApplicationsAcceptedType: string
    resoFacts: ResoFacts
    responsivePhotos: ResponsivePhoto[]
    responsivePhotosOriginalRatio: ResponsivePhotosOriginalRatio[]
    restimateHighPercent?: any
    restimateLowPercent?: any
    richMedia?: any
    richMediaVideos?: any
    schools: School[]
    sellingSoon: any[]
    solarPotential: SolarPotential
    ssid?: any
    state: string
    stateId: number
    stateSearchUrl: StateSearchUrl
    staticMap: StaticMap
    streetAddress: string
    streetView: StreetView
    streetViewMetadataUrlMapLightboxAddress: string
    streetViewMetadataUrlMediaWallAddress: string
    streetViewMetadataUrlMediaWallLatLong: string
    streetViewServiceUrl: string
    streetViewTileImageUrlMediumAddress: string
    streetViewTileImageUrlMediumLatLong: string
    taxAssessedValue: number
    taxAssessedYear: number
    taxHistory: TaxHistory[]
    thirdPartyVirtualTour: ThirdPartyVirtualTour
    thumb: Thumb[]
    timeOnZillow: string
    timeZone: string
    topNavJson: TopNavJson
    tourEligibility: TourEligibility
    tourPhotos: TourPhoto[]
    tourViewCount: number
    unassistedShowing?: any
    virtualTourUrl?: any
    vrModel: VrModel
    whatILove?: any
    yearBuilt: number
    zestimate: number
    zestimateDeepDiveData: ZestimateDeepDiveData
    zestimateHighPercent: string
    zestimateLowPercent: string
    zillowOfferMarket: ZillowOfferMarket
    zipPlusFour: string
    zipcode: string
    zipcodeSearchUrl: ZipcodeSearchUrl
    zoContactSubtitle?: any
    zoMarketName?: any
    zoResaleStartAnOfferEnabled: boolean
    zpid: number
  }
}

declare namespace ZillowMultiplePropertiesNameSpace {
  export interface ListingSubType {
    is_FSBA: boolean
  }

  export interface ZillowMultiplePropertiesObj {
    bathrooms: number
    bedrooms: number
    city: string
    country: string
    currency: string
    datePriceChanged: number
    daysOnZillow: number
    homeStatus: string
    homeStatusForHDP: string
    homeType: string
    imgSrc: string
    isFeatured: boolean
    isNonOwnerOccupied: boolean
    isPreforeclosureAuction: boolean
    isPremierBuilder: boolean
    isUnmappable: boolean
    isZillowOwned: boolean
    latitude: number
    listing_sub_type: ListingSubType
    livingArea: number
    longitude: number
    lotAreaUnit: string
    lotAreaValue: number
    price: number
    priceChange: number
    priceForHDP: number
    rentZestimate: number
    shouldHighlight: boolean
    state: string
    streetAddress: string
    taxAssessedValue: number
    zestimate: number
    zipcode: string
    zpid: number
  }
}

declare namespace ZestimateHistoryNameSpace {
  export interface ZestimateHistory {
    date: string
    timestamp: number
    value: number
  }
}

declare namespace ListDigitalReNameSpace {
  export interface ListData {
    contractAddress?: string
    url?: string
    rentPerToken?: string
    tokenPrice?: string
    reId: string
    address: string
    totalTokens: number
    lastTradedPrice: string
    platFormFees: number
    assetPrice: number
    totalInverstment: number
    country: 'USA'
    state: string
    zestimate: any
    company: string
    estROI: number
  }
}
