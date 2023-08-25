interface IdNumberRequest {
  type: string
  value: string
  stateCode?: string | null
}

interface IdNumber {
  type?: string
  value?: string
  stateCode?: string | null
}

interface IAddressOptional {
  flatNumber?: string | null
  buildingNumber?: string | null
  buildingName?: string | null
  street?: string | null
  subStreet?: string | null
  town?: string | null
  state?: string | null
  line1?: string | null
  line2?: string | null
  line3?: string | null
}

interface IAddressRequest extends IAddressOptional {
  postcode: string
  country: string
}

interface IAddress extends IAddressOptional {
  postcode?: string
  country?: string
}

export interface IApplicantRequest {
  user_id?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  dob?: string | null
  address?: IAddressRequest | null
  idNumbers?: IdNumberRequest[] | null
}

export interface IApplicant {
  id: string
  createdAt?: string | null
  deleteAt?: string | null
  href: string
  firstName: string
  lastName: string
  email: string | null
  dob: string | null
  address: IAddress | null
  idNumbers: IdNumber[] | null
}

export interface IOnfidoDocuments {
  applicant_id: string
  created_at: Date
  download_href: string
  file_name: string
  file_size: number
  file_type: string
  href: string
  id: string
  issuing_country?: string
  side: string
  type: string
}

export interface IGenerateSdkToken {
  applicantId: string
  applicationId?: string | null
  referrer?: string | null
  crossDeviceUrl?: string | null
}

export interface IReport {
  id: string
  createdAt: string
  name: string
  href: string
  status: string
  result: string | null
  subResult: string | null
  properties: string | null
  breakdown: string | null
  documents: string | null
  checkId: string
}

export interface IOnfidoDBResponse {
  user_id: string | null
  applicantId: string | null
}

interface WebhooksResponse {
  id: string | null
  url: string | null
  enabled: boolean
  href: string | null
  token: string | null
  environments: [string]
  events: [string]
}

export interface IOnfidoWebhookResponse {
  webhooks?: [WebhooksResponse]
}
