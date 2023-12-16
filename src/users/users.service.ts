import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { AuthService } from 'src/auth/auth.service';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(private authService: AuthService) {}
  async create(value: UserDto) {
    const user = await this.getByEmail(value);
    if (user) {
      return new ConflictException('duplicate email');
    }
    if (!value.provider) {
      value.provider = 'petDiary';
    }
    value.status = 'active';
    value.password = await this.hashPassword(value.password);
    await User.create(value);
    return;
  }

  async getById(id: string) {
    return User.findByPk(id, {
      attributes: ['email', 'provider'],
    });
  }

  async getByEmail(userDto: UserDto) {
    return User.findOne({
      attributes: ['email', 'password', 'provider', 'status'],
      where: {
        email: userDto.email,
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
