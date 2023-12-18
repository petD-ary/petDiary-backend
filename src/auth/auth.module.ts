import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'process.env.JWT_SECRET', // 비밀키를 설정합니다.
      signOptions: { expiresIn: '1d' }, // 토큰의 유효 기간을 설정합니다.
    }),
  ],
  providers: [AuthService, AuthGuard, JwtStrategy],
  exports: [AuthService, AuthGuard, JwtStrategy],
})
export class AuthModule {}
