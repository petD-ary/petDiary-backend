import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const accessToken = req.cookies?.accessToken;

    // accessToken 이 쿠키에 있으면 헤더에 추가합니다.
    if (accessToken) {
      req.headers.authorization = `Bearer ${accessToken}`;
    }
    return req;
  }

  handleRequest(err, user) {
    console.log(err);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
