import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

interface IOAuthUser {
  //interface 설정
  user: {
    provider: string;
    name: string;
    email: string;
    password: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return this.authService.OAuthLogin({ req, res });
  }

  @Get('/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return this.authService.OAuthLogin({ req, res });
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return this.authService.OAuthLogin({ req, res });
  }
}
