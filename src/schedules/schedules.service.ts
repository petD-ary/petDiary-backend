import { Injectable } from '@nestjs/common';
import { DestroyOptions, UpdateOptions } from 'sequelize';

import { ScheduleDto, ScheduleDtoWithoutId } from './dto/schedule.dto';
import { Schedule } from './entity/schedule.entity';
import { REPEAT, RepeatDtoWithoutId } from './dto/repeat.dto';
import { Repeat } from './entity/repeat.entity';

@Injectable()
export class SchedulesService {
  async create(value: ScheduleDtoWithoutId) {
    await Schedule.create(value);
    return;
  }

  async createRepeat(value: RepeatDtoWithoutId) {
    return await Repeat.create(value);
  }

  async createRepeatSchedule(value: ScheduleDtoWithoutId) {
    const { repeat, repeatCount = 1 } = value;
    delete value.repeat;
    delete value.repeatCount;

    if (repeat === REPEAT.NONE) {
      await Schedule.create(value);
    } else {
      const repeatId = (await this.createRepeat({ repeat, repeatCount })).id;
      const baseStartTime = new Date(value.startTime);
      const baseEndTime = new Date(value.endTime);

      for (let i = 0; i < repeatCount; i++) {
        const startTime = this.adjustDate(
          baseStartTime,
          repeat,
          i,
        ).toISOString();
        const endTime = this.adjustDate(baseEndTime, repeat, i).toISOString();

        await Schedule.create({
          ...value,
          repeatId,
          startTime,
          endTime,
        });
      }
    }

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

  adjustDate(date: Date, repeat: REPEAT, count: number) {
    const newDate = new Date(date);
    switch (repeat) {
      case REPEAT.DAILY:
        newDate.setDate(date.getDate() + count);
        break;
      case REPEAT.WEEKLY:
        newDate.setDate(date.getDate() + count * 7);
        break;
      case REPEAT.BIWEEKLY:
        newDate.setDate(date.getDate() + count * 14);
        break;
      case REPEAT.MONTHLY:
        newDate.setMonth(date.getMonth() + count);
        break;
      case REPEAT.YEARLY:
        newDate.setFullYear(date.getFullYear() + count);
        break;
      default:
        throw new Error('Invalid repeat type');
    }
    return newDate;
  }
}
