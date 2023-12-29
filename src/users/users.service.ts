import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { AuthService } from 'src/auth/auth.service';
import { UserDto } from './dto/user.dto';
import { STATUS, User } from './entity/user.entity';
import { PetDto } from 'src/pets/dto/pet.dto';
import { Pet } from 'src/pets/entity/pet.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}
  async create(body: { user: UserDto; pet: PetDto }) {
    const duplicatedUser = await this.getByEmail(body.user);
    if (duplicatedUser) {
      return new ConflictException('duplicate email');
    }
    if (!body.user.provider) {
      body.user.provider = 'petDiary';
    }
    body.user.status = STATUS.ACTIVE;
    body.user.password = await this.hashPassword(body.user.password);
    const user = await User.create(body.user);
    body.pet.userId = user.id;
    await Pet.create(body.pet);
    return;
  }

  async createUser(user: UserDto) {
    user.password = await this.hashPassword(user.status);
    return await User.create(user);
  }

  async getByEmail(userDto: UserDto) {
    return User.findOne({
      attributes: ['email', 'password', 'provider', 'status'],
      where: {
        email: userDto.email,
      },
    });
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
      attributes: ['email', 'password', 'provider', 'status'],
      where: {
        nickname: nickname,
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

  async delete(id: string) {
    return User.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    }).then(() => ({}));
  }

  async addInfo(userDto: UserDto, info: { user: UserDto; pet: PetDto }) {
    const user = await this.getByEmailAndProvider(userDto);
    const updateData = { nickname: info.user.nickname, status: STATUS.ACTIVE };
    await this.update(updateData, user);

    info.pet.userId = user.id;
    await Pet.create(info.pet);
    return;
  }

  async login(value: UserDto) {
    const user = await this.getByEmail(value);
    if (user && (await bcrypt.compare(value.password, user.password))) {
      return this.authService.login(user);
    }

    throw new UnauthorizedException('not user');
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
