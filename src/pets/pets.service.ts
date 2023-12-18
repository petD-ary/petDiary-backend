import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

import { PetDto } from './dto/pet.dto';
import { Pet } from './entity/pet.entity';

@Injectable()
export class PetsService {
  async create(value: PetDto) {
    await Pet.create(value);
    return;
  }

  async getById(id: string) {
    return Pet.findByPk(id, {
      attributes: ['email', 'provider'],
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
