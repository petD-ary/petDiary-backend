import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'petDiary@secretKey172', // 비밀키를 설정합니다.
      signOptions: { expiresIn: '1d' }, // 토큰의 유효 기간을 설정합니다.
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
