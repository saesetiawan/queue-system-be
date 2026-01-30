import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResponse } from '../dtos/jwt.dto';
import {
  RefreshTokenDto,
  RefreshTokenResponse,
  ResetPasswordResponse,
} from '../dtos/refresh_token.dto';
import { CreateUserDto } from '../dtos/create_user.dto';
import { RedisService } from '../../redis/redis.service';
import { RedisConstants } from '../constants/redis.constant';
import { ResetPasswordDto } from '../dtos/reset_password.dto';
import { EncryptionService } from '../../common/services/encryption.service';
import { ResetPasswordTokenPayload } from '../../brevo/brevo.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async login(payload: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(payload.email);
    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }
    const matchedPassword = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!matchedPassword) {
      throw new UnauthorizedException();
    }
    const jwtPayload: JwtPayload = {
      email: user.email,
      companyId: user.userCompanies[0]?.company.id,
    };
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '9m',
    });
    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1d',
    });
    await this.redisService.write(
      RedisConstants.REDIS_KEY_REFRESH_TOKEN + user.email,
      refreshToken,
      RedisConstants.REDIS_EXPIRE_TIME_REFRESH_TOKEN,
    );
    return {
      type: 'Bearer',
      accessToken: token,
      refreshToken,
    };
  }

  async signUp(payload: CreateUserDto): Promise<LoginResponse> {
    const user = await this.userService.create(payload);
    const jwtPayload: JwtPayload = {
      email: user.email,
      companyId:
        user?.userCompanies?.length > 0
          ? user?.userCompanies[0]?.company.id
          : '',
    };
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '9m',
    });
    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1d',
    });
    return {
      type: 'Bearer',
      accessToken: token,
      refreshToken,
    };
  }

  async refreshToken(payload: RefreshTokenDto): Promise<RefreshTokenResponse> {
    const { email, companyId }: JwtPayload = this.jwtService.decode(
      payload.refreshToken,
    );
    const refreshToken = await this.redisService.read<string>(
      RedisConstants.REDIS_KEY_REFRESH_TOKEN + email,
    );
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const jwtPayload: JwtPayload = {
      email,
      companyId,
    };
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '9m',
    });
    return {
      accessToken: token,
    };
  }

  async resetPassword(
    payload: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    const decryptedToken =
      this.encryptionService.decrypt<ResetPasswordTokenPayload>(payload.token);
    if (
      !decryptedToken ||
      !decryptedToken.email ||
      Date.now() > decryptedToken.exp
    ) {
      throw new UnauthorizedException('Invalid token');
    }
    await this.userService.setNewPassword(
      decryptedToken.email,
      payload.password,
    );
    return {
      message: 'Password has been reset successfully',
    };
  }
}
