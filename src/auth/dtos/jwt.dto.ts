export interface JwtPayload {
  email: string;
  companyId: string;
}

export interface LoginResponse {
  type: string;
  accessToken: string;
  refreshToken: string;
}
