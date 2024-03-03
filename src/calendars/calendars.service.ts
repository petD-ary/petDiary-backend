import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

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

  async update(id: string, calendarDto: CalendarDto) {
    return Calendar.update(
      {
        ...calendarDto,
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
    return Calendar.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    }).then(() => ({}));
  }
}
