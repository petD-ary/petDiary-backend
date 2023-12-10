import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Op } from 'sequelize';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  async create(value: Partial<UserDto | User>) {
    console.log(value);
    return User.create(value);
  }

  async getById(id: number) {
    return User.findByPk(id, {
      attributes: ['name', 'email', 'role'],
    });
  }

  async getByAll() {
    return User.findAll({
      raw: true,
      attributes: ['name', 'email', 'role'],
    });
  }

  async update(id: number, userDto: UserDto) {
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

  async remove(id: number) {
    return User.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    }).then(() => ({}));
  }
}
