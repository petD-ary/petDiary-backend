import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

import { PetDto, PetDtoWithoutId } from './dto/pet.dto';
import { Pet } from './entity/pet.entity';

@Injectable()
export class PetsService {
  async create(value: PetDtoWithoutId) {
    await Pet.create(value);
    return;
  }

  async getByUserId(userId: string) {
    return Pet.findAll({
      where: {
        userId: userId,
      },
    });
  }

  async getByAll() {
    return Pet.findAll({
      raw: true,
      attributes: ['email', 'provider'],
    });
  }

  async update(id: string, petDto: PetDto) {
    return Pet.update(
      {
        ...petDto,
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
    return Pet.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    }).then(() => ({}));
  }
}
