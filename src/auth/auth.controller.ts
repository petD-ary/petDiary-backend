import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService, IOAuthUser } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return this.authService.OAuthLogin(req, res);
  }

  @Get('/kakao/withdraw')
  @UseGuards(AuthGuard('kakao-withdraw'))
  async withdrawKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    await this.authService.unlinkKakaoUser(req);
    return await this.usersService.withdraw(req, res);
  }

  @Get('/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return this.authService.OAuthLogin(req, res);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return this.authService.OAuthLogin(req, res);
  }

  @ApiOperation({
    summary: 'accessToken 요청',
  })
  @Post('/token')
  async getToken(@Req() req: Request, @Res() res: Response) {
    this.authService.getToken(req, res);
  }
}
