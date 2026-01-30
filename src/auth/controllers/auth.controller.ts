import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponse } from '../dtos/jwt.dto';
import { AuthService } from '../services/auth.service';
import {
  RefreshTokenDto,
  RefreshTokenResponse, ResetPasswordResponse,
} from '../dtos/refresh_token.dto';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { UserDecorator } from '../decorators/user.decorator';
import { User } from '../entitites/user.entity';
import { ResetPasswordDto } from '../dtos/reset_password.dto';
import { CreateUserDto } from '../dtos/create_user.dto';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() payload: LoginDto): Promise<LoginResponse> {
    return this.authService.login(payload);
  }

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  signUp(@Body() payload: CreateUserDto): Promise<LoginResponse> {
    return this.authService.signUp(payload);
  }

  @Post('/refresh-token')
  refreshToken(
    @Body() payload: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(payload);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/auth/current-user')
  currentUser(@UserDecorator() user: User) {
    return user;
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() payload: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.authService.resetPassword(payload);
  }
}
