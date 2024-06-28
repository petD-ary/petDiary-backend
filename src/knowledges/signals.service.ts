import { Injectable } from '@nestjs/common';
import { DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import { SignalDto, SignalDtoWithoutId } from './dto/signal.dto';
import { Signal } from './entity/signal.entity';

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
}
