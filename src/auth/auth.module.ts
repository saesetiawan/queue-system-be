import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitites/user.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserCompany } from './entitites/user_company.entity';
import { RedisModule } from '../redis/redis.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    RedisModule,
    JwtModule.register({
      global: true,
      privateKey: fs.readFileSync('cert/jwt_private_key.pem'),
      publicKey: fs.readFileSync('cert/jwt_public_key.pem'),
      signOptions: {
        algorithm: 'RS256', // penting: gunakan algoritma sesuai jenis key
        expiresIn: '60s',
      },
    }),
    TypeOrmModule.forFeature([User, UserCompany]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [TypeOrmModule, UserService],
})
export class AuthModule {}
