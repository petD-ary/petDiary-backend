import { Injectable } from '@nestjs/common';
import { DestroyOptions, UpdateOptions } from 'sequelize';

import { CalendarDto, CalendarDtoWithoutId } from './dto/calendar.dto';
import { Calendar } from './entity/calendar.entity';

@Injectable()
export class CalendarsService {
  async create(value: CalendarDtoWithoutId) {
    await Calendar.create(value);
    return;
  }

  async getByUserId(userId: string) {
    return Calendar.findAll({
      where: {
        userId: userId,
      },
    });
  }

  async getByAll() {
    return Calendar.findAll({
      raw: true,
      attributes: ['email', 'provider'],
    });
  }

  async update(calendarDto: CalendarDto, options: UpdateOptions) {
    return Calendar.update(calendarDto, options);
  }

  async delete(options: DestroyOptions) {
    return Calendar.destroy(options);
  }
}
