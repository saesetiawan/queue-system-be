import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ResetPasswordResponse {
  message: string;
}
