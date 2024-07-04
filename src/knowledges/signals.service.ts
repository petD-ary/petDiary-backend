import { Injectable } from '@nestjs/common';
import { DestroyOptions, FindOptions, Op, UpdateOptions } from 'sequelize';

import { SignalDto, SignalDtoWithoutId } from './dto/signal.dto';
import { Signal } from './entity/signal.entity';
import { Sequelize } from 'sequelize-typescript';

interface SignalOptions extends FindOptions {
  type?: string;
}

@Injectable()
export class SignalsService {
  async create(value: SignalDtoWithoutId) {
    Signal.create(value);
    return;
  }

  async createAll(values: SignalDtoWithoutId[]) {
    for (const value of values) {
      await this.create(value);
    }
    return;
  }

  async getByAll(options?: FindOptions) {
    return Signal.findAll(options);
  }

  async getBy(options?: FindOptions) {
    return Signal.findOne(options);
  }

  async update(signalDto: SignalDto, options: UpdateOptions) {
    return Signal.update(signalDto, options);
  }

  async delete(options: DestroyOptions) {
    return Signal.destroy(options);
  }

  createSignalOptions(type, search) {
    let options: SignalOptions = {
      where: {
        type,
      },
    };

    if (search) {
      options = {
        where: {
          ...options.where,
          [Op.or]: [
            Sequelize.literal(`EXISTS (
              SELECT 1
              FROM jsonb_each(summary)
              WHERE CAST(value AS TEXT) ILIKE '%${search}%'
            )`),
            Sequelize.literal(`EXISTS (
              SELECT 1
              FROM jsonb_each(title)
              WHERE CAST(value AS TEXT) ILIKE '%${search}%'
            )`),
          ],
        },
      };
    }

    return options;
  }
}
