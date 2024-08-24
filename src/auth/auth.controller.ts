import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

interface IOAuthUser {
  user: {
    provider: string;
    name: string;
    email: string;
    password: string;
  };
}

@Controller('auth')
@ApiTags('auth')
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

  @ApiOperation({
    summary: 'accessToken 요청',
  })
  @Post('/token')
  async getToken(@Req() req: Request, @Res() res: Response) {
    this.authService.getToken({ req, res });
  }
}
