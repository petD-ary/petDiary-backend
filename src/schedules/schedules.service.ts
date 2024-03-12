import { Injectable } from '@nestjs/common';
import { DestroyOptions, UpdateOptions } from 'sequelize';

import { ScheduleDto, ScheduleDtoWithoutId } from './dto/schedule.dto';
import { Schedule } from './entity/schedule.entity';

@Injectable()
export class SchedulesService {
  async create(value: ScheduleDtoWithoutId) {
    await Schedule.create(value);
    return;
  }

  async getByUserId(userId: string) {
    return Schedule.findAll({
      where: {
        userId: userId,
      },
    });
  }

  async getByAll() {
    return Schedule.findAll({
      raw: true,
      attributes: ['email', 'provider'],
    });
  }

  async update(scheduleDto: ScheduleDto, options: UpdateOptions) {
    return Schedule.update(scheduleDto, options);
  }

  async delete(options: DestroyOptions) {
    return Schedule.destroy(options);
  }
}
