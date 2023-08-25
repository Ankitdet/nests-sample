export interface CoinifyPaymentData {
  id: number
  uuid: string
  create_time: string
  expire_time: string
  state: 'new' | 'paid' | 'complete' | 'expired'
  type: 'normal' | 'underpaid' | 'extra'
  bitcoin: {
    amount: number
    address: string
    amount_paid: number
    amount_due: number
    payment_uri: string
  }
  native: {
    amount: number
    currency: string
  }
  transfer: {
    amount: number
    currency: string
  }
  description: string
  custom: {
    re_id: string
    user_id: string
    order_id: string
  }
  payment_url: string
  inputs: ReadonlyArray<{
    currency: string
    amount: number
    address: string
    return_address: string
    payment_uri: string
    verified: boolean
    timestamp: string
  }>
  callback_url: string
  callback_email: string
  return_url: string
  cancel_url: string
  payments: [] // Bitcoin transactions to this payment
  original_invoice_id?: number // optional
  sub_invoice_ids?: ReadonlyArray<number> // optional
}

export interface CoinifyPaymentResponse {
  success?: boolean
  data: CoinifyPaymentData
}

export interface PaymentInput {
  amount?: number
  user_id: string
  re_id: string
  description?: string
}

export interface PaymentBody {
  amount: number
  currency: string
  plugin_name: string
  plugin_version: string
  customer_id?: string
  description?: string
  custom?: { [key: string]: string }
  callback_url?: string
  callback_email?: string
  return_url?: string
  cancel_url?: string
  input_currency?: string
  input_return_address?: string
  input_return_address_tag?: string
}
