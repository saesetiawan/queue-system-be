import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import { JwtPayload } from '../dtos/jwt.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 🔥 extract dari header Authorization: Bearer xxx
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: fs.readFileSync('cert/jwt_public_key.pem'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // payload = isi token yang di-sign
    // misal { sub: userId, email: xxx }
    return { email: payload.email, companyId: payload.companyId };
  }
}
