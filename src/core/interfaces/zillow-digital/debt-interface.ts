import { DigitalBondsInf } from './bonds-interface'

export interface DebtDigitalRespInf extends DigitalBondsInf {
  debtName: string
  debtSize: string
  debtTenure: string
  debtType: string
  endDate: string
  estRoi: string
  startDate: string
  status: string
  debtId: string
  companyName: string
  url: string
  blockchain: string
}

export interface DebtDigitalDBSchemaInf extends DigitalBondsInf {
  pk: string
  sk: string
  companyName: string
  created_at: string
  debt: Debt
  debtId: string
  gsi1_pk: string
  gsi1_sk: string
  updated_at: string
  url: string
}

interface Debt {
  debtName: string
  debtSize: string
  debtTenure: string
  debtType: string
  endDate: string
  estRoi: string
  startDate: string
  status: string
}
