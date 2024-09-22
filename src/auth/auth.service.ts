import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import axios from 'axios';

import { UserDto } from 'src/users/dto/user.dto';
import { STATUS } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

export interface IOAuthUser {
  user: UserDto & { accessToken: string };
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async login(user: UserDto) {
    const accessToken = this.makeAccessToken(user);
    const refreshToken = this.makeRefreshToken(user);
    await this.usersService.update({ refreshToken }, user);
    return { accessToken, refreshToken };
  }

  async unlinkKakaoUser(req: Request & IOAuthUser) {
    const accessToken = req.user.accessToken;

    try {
      await axios.post(
        'https://kapi.kakao.com/v1/user/unlink',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return true;
    } catch (error) {
      console.error(
        'Error unlinking Kakao user:',
        error.response?.data || error.message,
      );
      return false;
    }
  }

  makeAccessToken(user: UserDto) {
    const payload = { email: user.email, sub: user.provider, id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
    return accessToken;
  }

  makeRefreshToken(user: UserDto) {
    const payload = { email: user.email };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return refreshToken;
  }

  async OAuthLogin(req: Request & IOAuthUser, res: Response) {
    let user = await this.usersService.getByEmailAndProvider(req.user);

    // 회원가입이 안되어있다면? 회원가입
    if (!user) {
      user = await this.usersService.createUser({
        ...req.user,
        password: 'No',
        status: STATUS.TEMPORARY,
        provider: req.user.provider,
      });
    }

    // 토큰 발행
    const { accessToken, refreshToken } = await this.login(user);

    // 쿠키에 토큰 등록
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('status', user.status, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    const origin = req.query.origin;
    return res.redirect(
      `${origin}/auth?refreshToken=${refreshToken}&status=${user.status}`,
    );
  }

  /**
   * 주어진 요청 객체에서 refreshToken을 추출하고,
   * 해당 토큰의 유효성을 검사하여 만료 여부를 확인
   *
   * 유효한 refreshToken이 제공되면 새로운 accessToken을 생성하여
   * 클라이언트의 쿠키에 저장
   */
  async getToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: '리프레시 토큰을 찾을 수 없습니다.' });
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '리프레시 토큰이 만료되었습니다.' });
      } else if (error.name === 'JsonWebTokenError') {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '유효하지 않은 리프레시 토큰입니다.' });
      } else {
        console.error('Error while verifying refresh token:', error);
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: '서버 내부 오류가 발생했습니다.' });
      }
    }

    const accessToken = await this.makeAccessTokenByRefreshToken(refreshToken);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    return res.json();
  }

  /**
   * DB에서 refreshToken로 사용자를 찾아, 사용자 정보로 accessToken 발급
   */
  async makeAccessTokenByRefreshToken(refreshToken: string) {
    const user = await this.usersService.getByRefreshToken(refreshToken);
    const accessToken = this.makeAccessToken(user);
    return accessToken;
  }
}
