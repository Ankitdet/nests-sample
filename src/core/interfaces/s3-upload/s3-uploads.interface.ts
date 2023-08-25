export interface Uploaded {
  ETag: string
  Location: string
  key: string
  Key: string
  Bucket: string
}

export interface DeleteKeys {
  Key: string
}

export interface IPreSignedUrl {
  key?: string
  url?: string
}

export interface IPPMDocumentLink {
  ppmLink?: string
  operatingLink?: string
  subscriptionLink?: string
}
