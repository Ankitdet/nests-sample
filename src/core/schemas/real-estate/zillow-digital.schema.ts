export interface ZillowDigitalDBSchema {
  abbreviatedAddress?: string
  address?: Address
  bathrooms?: number
  bedrooms?: number
  big?: Big[]
  city?: string
  country?: string
  county?: string
  countyFIPS?: string
  currency?: string
  dateSold?: number
  dateSoldString?: string
  description?: string
  desktopWebHdpImageLink?: string
  homeType?: string
  homeStatus?: string
  hugePhotos?: HugePhoto[]
  lastSoldPrice?: number
  livingArea?: number
  livingAreaUnits?: string
  lotSize?: number
  photos?: Photo[]
  primaryPublicVideo?: any
  propertyEventLogLink?: any
  propertyTaxRate?: number
  propertyTypeDimension?: string
  propertyUpdatePageLink?: any
  providerListingID?: any
  regionString?: string
  rentZestimate?: number
  rentalApplicationsAcceptedType?: string
  resoFacts?: ResoFacts
  zpid?: number
  allData?: any
}

export interface Address {
  city?: string
  community?: any
  neighborhood?: any
  state?: string
  streetAddress?: string
  subdivision?: any
  zipcode?: string
}

export interface Big {
  subjectType?: any
  url?: string
  width?: number
}

export interface HugePhoto {
  caption?: string
  height?: number
  url?: string
  width?: number
}

export interface Photo {
  caption?: string
  mixedSources?: MixedSources
}

export interface MixedSources {
  jpeg?: Jpeg[]
  webp?: Webp[]
}

export interface Jpeg {
  url?: string
  width?: number
}

export interface Webp {
  url?: string
  width?: number
}

export interface ResoFacts {
  atAGlanceFacts?: AtAglanceFact[]
  attic?: any
  availabilityDate?: any
  basement?: string
  basementYN?: boolean
  bathrooms?: number
  bathroomsFull?: number
  bathroomsHalf?: number
  bathroomsOneQuarter?: number
  bathroomsPartial?: any
  bathroomsThreeQuarter?: number
  bedrooms?: number
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
  canRaiseHorses?: boolean
  carportSpaces?: any
  cityRegion?: string
  commonWalls?: any
  communityFeatures?: any[]
  constructionMaterials?: string[]
  cooling?: any[]
  coveredSpaces?: any
  cropsIncludedYN?: any
  daysOnZillow?: number
  depositsAndFees?: any
  developmentStatus?: any
  doorFeatures?: any
  electric?: any
  elementarySchool?: any
  elementarySchoolDistrict?: string
  elevation?: any
  elevationUnits?: any
  entryLevel?: any
  entryLocation?: any
  exclusions?: any
  exteriorFeatures?: string[]
  fencing?: any
  fireplaceFeatures?: any
  fireplaces?: any
  flooring?: any[]
  foundationArea?: any
  foundationDetails?: any[]
  frontageLength?: any
  frontageType?: any
  furnished?: boolean
  garageSpaces?: any
  gas?: any
  greenBuildingVerificationType?: any
  greenEnergyEfficient?: any
  greenIndoorAirQuality?: any
  greenSustainability?: any
  greenWaterConservation?: any
  hasAdditionalParcels?: boolean
  hasAssociation?: any
  hasAttachedGarage?: any
  hasAttachedProperty?: boolean
  hasCarport?: any
  hasCooling?: boolean
  hasElectricOnProperty?: any
  hasFireplace?: any
  hasGarage?: boolean
  hasHeating?: boolean
  hasHomeWarranty?: boolean
  hasLandLease?: boolean
  hasOpenParking?: any
  hasPetsAllowed?: any
  hasPrivatePool?: any
  hasRentControl?: any
  hasSpa?: boolean
  hasView?: boolean
  hasWaterfrontView?: any
  heating?: string[]
  highSchool?: any
  highSchoolDistrict?: string
  hoaFee?: any
  homeType?: string
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
  livingArea?: string
  livingAreaRange?: any
  livingAreaRangeUnits?: any
  lotFeatures?: any
  lotSize?: string
  lotSizeDimensions?: any
  mainLevelBathrooms?: any
  mainLevelBedrooms?: any
  marketingType?: any
  middleOrJuniorSchool?: any
  middleOrJuniorSchoolDistrict?: string
  municipality?: any
  numberOfUnitsInCommunity?: any
  numberOfUnitsVacant?: any
  offerReviewDate?: any
  onMarketDate?: any
  openParkingSpaces?: any
  otherEquipment?: any
  otherFacts?: OtherFact[]
  otherParking?: any
  otherStructures?: any
  ownership?: any
  ownershipType?: any
  parcelNumber?: string
  parking?: number
  parkingFeatures?: string[]
  patioAndPorchFeatures?: any
  petsMaxWeight?: any
  poolFeatures?: any
  pricePerSquareFoot?: number
  propertyCondition?: any
  propertySubType?: any
  roadSurfaceType?: any
  roofType?: string
  rooms?: any[]
  securityFeatures?: any
  sewer?: any
  spaFeatures?: any
  specialListingConditions?: any
  stories?: any
  storiesTotal?: any
  structureType?: string
  subdivisionName?: any
  taxAnnualAmount?: any
  tenantPays?: any
  topography?: any
  totalActualRent?: any
  utilities?: any
  vegetation?: any
  view?: any[]
  virtualTour?: any
  virtualTourURLUnbranded?: any
  waterBodyName?: any
  waterSource?: any
  waterSources?: any
  waterView?: string
  waterViewYN?: any
  waterfrontFeatures?: any
  windowFeatures?: any
  woodedArea?: any
  yearBuilt?: number
  yearBuiltEffective?: any
  zoning?: any
  zoningDescription?: any
}

export interface AtAglanceFact {
  factLabel?: string
  factValue?: string
}

export interface OtherFact {
  name?: string
  value?: string
}
