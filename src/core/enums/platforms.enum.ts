// While uploading csv with contractAddress or Blockchain Data or webscrapping data.
export enum PlatformName {
  REALt = 'realt',
  LoftY = 'lofty',
  '3Blocks' = '3blocks',
  RoofStock = 'roofstock',
  Akru = 'akru',
  Centrifuge = 'centrifuge',
}

// While uploading csv with webscrapped data from UI which has unique column.
export enum PlatformUniqueAttr {
  REALt = 'fullAddress',
  LoftY = 'fullAddress',
  '3Blocks' = 'fullAddress',
}

// while uploading any digital assest make sure company Url should exists.
export enum CompanyUrls {
  realt = 'https://realt.co',
  lofty = 'https://www.lofty.ai',
  '3blocks' = 'https://3blocks.io',
  blueJay = 'https://app.bluejay.finance',
  Ondo = 'https://ondo.finance',
  freeport = 'https://freeport.app',
  roofstock = 'https://roofstockonchain.com',
  akru = 'https://www.akru.co',
  'Cytus Finance' = 'https://app.cytus.finance/',
}

export enum QueryString {
  realestate = 'realestate',
  debt = 'debt',
}
