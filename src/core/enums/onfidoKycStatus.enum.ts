export enum OnfidoKycStatus {
  approved,
}

export const getKycStatus = (input: OnfidoKycStatus) => {
  return OnfidoKycStatus[input]
}
