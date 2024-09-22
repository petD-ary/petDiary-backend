import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      email: profile._json.kakao_account.email,
      provider: profile.provider,
      accessToken,
    };
  }
}

@Injectable()
export class KakaoWithdrawStrategy extends PassportStrategy(
  Strategy,
  'kakao-withdraw',
) {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_WITHDRAW_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      email: profile._json.kakao_account.email,
      provider: profile.provider,
      accessToken,
    };
  }
}
