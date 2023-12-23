import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { KakaoStrategy } from './kakao.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { NaverStrategy } from './naver.strategy';
import { GoogleStrategy } from './google.strategy';

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: 'process.env.JWT_SECRET', // 비밀키를 설정합니다.
      signOptions: { expiresIn: '1d' }, // 토큰의 유효 기간을 설정합니다.
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    JwtStrategy,
    KakaoStrategy,
    NaverStrategy,
    GoogleStrategy,
  ],
  exports: [
    AuthService,
    AuthGuard,
    JwtStrategy,
    KakaoStrategy,
    NaverStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
