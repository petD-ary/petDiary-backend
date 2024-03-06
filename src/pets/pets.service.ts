import { Injectable } from '@nestjs/common';
import { DestroyOptions, UpdateOptions } from 'sequelize';

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

  async update(petDto: PetDto, options: UpdateOptions) {
    return Pet.update(petDto, options);
  }

  async delete(options: DestroyOptions) {
    return Pet.destroy(options);
  }
}
