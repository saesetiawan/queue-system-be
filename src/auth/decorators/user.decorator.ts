import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../dtos/jwt.dto';

export const UserDecorator = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
