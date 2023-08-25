export interface IJwtToken {
  idToken: string
  accessToken: string
  refreshToken: string
}

export interface IRefreshSession {
  accessToken: string
  idToken: string
}
