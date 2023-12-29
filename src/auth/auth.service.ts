import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user.provider };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async OAuthLogin({ req, res }) {
    let user = await this.usersService.getByEmailAndProvider(req.user);

    // 회원가입이 안되어있다면? 자동회원가입
    if (!user) {
      user = await this.usersService.createUser({
        ...req.user,
        password: 'No',
        status: 'temporary',
        provider: req.user.provider,
      });
    }

    // 토큰 발행
    const { accessToken } = await this.login(user);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.redirect('http://localhost:3000');
  }
}
