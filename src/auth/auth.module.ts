import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';
import {
  KakaoDevStrategy,
  KakaoDevWithdrawStrategy,
  KakaoStrategy,
  KakaoWithdrawStrategy,
} from './kakao.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { NaverStrategy } from './naver.strategy';
import { GoogleStrategy } from './google.strategy';

@Global()
@Module({
  imports: [forwardRef(() => UsersModule), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    JwtStrategy,
    KakaoStrategy,
    KakaoDevStrategy,
    KakaoWithdrawStrategy,
    KakaoDevWithdrawStrategy,
    NaverStrategy,
    GoogleStrategy,
  ],
  exports: [
    AuthService,
    AuthGuard,
    JwtStrategy,
    KakaoStrategy,
    KakaoDevStrategy,
    KakaoWithdrawStrategy,
    KakaoDevWithdrawStrategy,
    NaverStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
