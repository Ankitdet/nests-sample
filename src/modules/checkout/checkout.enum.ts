export enum PaymentStatus {
  Expired = 'expired',
  Complete = 'complete',
  Paid = 'paid',
  Failed = 'failed',
}

export const successOrder = [PaymentStatus.Complete]

export const failureOrder = [PaymentStatus.Expired, PaymentStatus.Paid]
