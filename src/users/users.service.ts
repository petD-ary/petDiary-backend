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
import { User } from './entity/user.entity';
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
    body.user.status = 'active';
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

  async getByEmailAndProvider(email: string, provider: string) {
    return User.findOne({
      attributes: ['email', 'provider', 'status'],
      where: {
        email: email,
        provider: provider,
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

  async getByAll() {
    return User.findAll({
      raw: true,
      attributes: ['email', 'provider'],
    });
  }

  async update(id: string, userDto: UserDto) {
    return User.update(
      {
        ...userDto,
      },
      {
        where: {
          id: {
            [Op.eq]: id,
          },
        },
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
