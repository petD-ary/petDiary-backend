import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from 'src/auth/auth.service';
import { Pet } from 'src/pets/entity/pet.entity';
import { LoginUserDto, PROVIDER, UserDto, UserInfoDto } from './dto/user.dto';
import { STATUS, User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  /*
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

  /*
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

  async addInfo(userDto: UserDto, info: UserInfoDto) {
    const user = await this.getByEmailAndProvider(userDto);
    const updateData = { nickname: info.user.nickname, status: STATUS.ACTIVE };
    await this.update(updateData, user);

    info.pet.userId = user.id;
    await Pet.create(info.pet);
    return;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
