import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { DestroyOptions } from 'sequelize';

import { AuthService, IOAuthUser } from 'src/auth/auth.service';
import { PetsService } from 'src/pets/pets.service';
import { SchedulesService } from 'src/schedules/schedules.service';
import { LoginUserDto, PROVIDER, UserDto, UserInfoDto } from './dto/user.dto';
import { STATUS, User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly petsService: PetsService,
    private readonly schedulesService: SchedulesService,
  ) {}

  /**
   * 소셜 로그인이 아닌 기존 회원 가입을 통한 유저 생성
   */
  async createNormalUser(userDto: LoginUserDto) {
    userDto['status'] = STATUS.TEMPORARY;
    userDto['provider'] = PROVIDER.PET_DIARY;
    userDto.password = await this.hashPassword(userDto.password);
    const duplicatedUser = await this.getByEmailAndProvider(userDto as UserDto);
    if (duplicatedUser) {
      throw new ConflictException('Duplicated user');
    }
    await User.create(userDto);
    return;
  }

  /**
   * 소셜 로그인이 아닌 기존 로그인
   */
  async normalLogin(userDto: LoginUserDto) {
    userDto['provider'] = PROVIDER.PET_DIARY;
    const user = await this.getByEmail(userDto as UserDto);
    if (user && (await bcrypt.compare(userDto.password, user.password))) {
      return this.authService.login(user);
    }

    throw new UnauthorizedException('Not founded user');
  }

  async createUser(user: UserDto) {
    return await User.create(user);
  }

  async getByEmailAndProvider(userDto: UserDto) {
    return User.findOne({
      attributes: ['id', 'email', 'provider', 'nickname', 'status'],
      where: {
        email: userDto.email,
        provider: userDto.provider,
      },
    });
  }

  async getByEmailAndPassword(userDto: UserDto) {
    return User.findOne({
      attributes: ['email', 'provider', 'status'],
      where: {
        email: userDto.email,
        password: userDto.password,
      },
    });
  }

  async getByNickname(nickname: string) {
    return User.findOne({
      attributes: ['email', 'provider', 'status'],
      where: {
        nickname: nickname,
      },
    });
  }

  async getByEmail(userDto: UserDto) {
    return User.findOne({
      attributes: ['email', 'password', 'provider', 'status'],
      where: {
        email: userDto.email,
        provider: userDto.provider,
      },
    });
  }

  async getByRefreshToken(refreshToken: string) {
    return User.findOne({
      attributes: ['id', 'email', 'provider', 'status'],
      where: {
        refreshToken: refreshToken,
      },
    });
  }

  async getByAll() {
    return User.findAll({
      raw: true,
    });
  }

  async update(updateData: Partial<UserDto>, userDto: UserDto) {
    return User.update(
      {
        ...updateData,
      },
      {
        where: {
          email: userDto.email,
          provider: userDto.provider,
        },
        returning: true,
      },
    );
  }

  async delete(options: DestroyOptions) {
    return User.destroy(options);
  }

  /**
   * 로그 아웃
   *
   * refrechToken db 에서 삭제,
   * cookie clear
   */
  async logout(user: UserDto, res: Response) {
    this.update({ refreshToken: '' }, user);
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json({});
  }

  /**
   * 회원 탈퇴
   *
   * pets, schedules, user 정보 삭제,
   * cookie clear
   */
  async withdraw(req: Request & IOAuthUser, res: Response) {
    const user = await this.getByEmailAndProvider(req.user);
    await this.petsService.delete({ where: { userId: user.id } });
    await this.schedulesService.deleteByUserId(user.id);
    await this.delete({ where: { id: user.id } });

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    const origin = req.query.origin;
    return res.redirect(`${origin}/login`);
  }

  async addInfo(userDto: UserDto, info: UserInfoDto) {
    const user = await this.getByEmailAndProvider(userDto);
    const updateData = { nickname: info.user.nickname, status: STATUS.ACTIVE };
    await this.update(updateData, user);

    info.pet.userId = user.id;
    await this.petsService.create(info.pet);
    return;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
