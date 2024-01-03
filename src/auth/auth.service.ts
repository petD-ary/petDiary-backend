import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { STATUS } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user.provider, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async OAuthLogin({ req, res }) {
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
    const { accessToken } = await this.login(user);

    // 쿠키에 토큰 등록
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    if (user.status === STATUS.TEMPORARY) {
      return res.redirect('http://localhost:3000/account');
    }
    return res.redirect('http://localhost:3000');
  }
}
