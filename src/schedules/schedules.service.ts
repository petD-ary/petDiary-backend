import { Injectable } from '@nestjs/common';
import { DestroyOptions, Optional, UpdateOptions } from 'sequelize';
import { plainToInstance } from 'class-transformer';

import { ScheduleDto, ScheduleDtoWithoutId } from './dto/schedule.dto';
import { Schedule } from './entity/schedule.entity';
import { REPEAT, RepeatDtoWithoutId } from './dto/repeat.dto';
import { Repeat } from './entity/repeat.entity';
import { NullishPropertiesOf } from 'sequelize/types/utils';

@Injectable()
export class SchedulesService {
  /**
   * 사용자가 정의한 반복 규칙(repeat, repeatCount)에 따라 일정 생성
   * - `repeat`와 `repeatCount`는 반복 규칙을 정의
   *    - `repeat`: 일정의 반복 유형을 정의 (반복 안함, 매일, 매주, 격주, 매월, 매년).
   *    - `repeatCount`: 일정이 반복되어야 하는 횟수를 정의.
   * - 반복 규칙은 별도의 `repeat` 테이블에 저장되며, 각 반복 일정은 생성 시 부여받은 `repeatId`로 연결
   * - `startTime`과 `endTime`은 Date 타입으로 변환하여 데이터베이스에 저장
   *    - 이는 일정을 기간으로 검색할 때 조회를 용이하게 하기 위함.
   */
  async createSchedule(value: ScheduleDtoWithoutId) {
    const {
      repeat,
      repeatCount = 1,
      startTime,
      endTime,
      ...scheduleDetails
    } = value;
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (repeat === REPEAT.NONE) {
      await this.createSingleSchedule({
        ...scheduleDetails,
        startTime: startDateTime,
        endTime: endDateTime,
      });
    } else {
      const repeatId = (await this.createRepeat({ repeat, repeatCount })).id;
      await this.createRepeatedSchedules(
        startDateTime,
        endDateTime,
        repeat,
        repeatCount,
        repeatId,
        scheduleDetails,
      );
    }

    return;
  }

  /**
   * 일정 생성
   */
  async createSingleSchedule(
    schedule: Optional<Schedule, NullishPropertiesOf<Schedule>>,
  ) {
    await Schedule.create(schedule);
  }

  /**
   * `repeatCount` 만큼 반복 일정 생성
   */
  async createRepeatedSchedules(
    baseStartTime: Date,
    baseEndTime: Date,
    repeat: string,
    repeatCount: number,
    repeatId: number,
    scheduleDetails: Optional<Schedule, NullishPropertiesOf<Schedule>>,
  ) {
    for (let i = 0; i < repeatCount; i++) {
      const startTime = this.adjustDate(baseStartTime, repeat, i);
      const endTime = this.adjustDate(baseEndTime, repeat, i);

      await Schedule.create({
        ...scheduleDetails,
        repeatId,
        startTime,
        endTime,
      });
    }
  }

  /**
   * `repeat`, `repeatCount` 저장
   */
  async createRepeat(value: RepeatDtoWithoutId) {
    return await Repeat.create(value);
  }

  async getByUserId(userId: string) {
    const scheduleEntity = await Schedule.scope('findAll').findAll({
      where: {
        userId: userId,
      },
    });
    // excludeExtraneousValues: true 추가하고, ScheduleDto 에서 @Expose() 데코레이터 추가하여
    // 명시된 필드만 객체를 직렬화하여 순환 참조 발생을 피한다.
    const scheduleDto = plainToInstance(ScheduleDto, scheduleEntity, {
      excludeExtraneousValues: true,
    });
    return scheduleDto;
  }

  async getByAll() {
    return Schedule.findAll({
      raw: true,
    });
  }

  // TODO 업데이트 수정
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(scheduleDto: ScheduleDto, options: UpdateOptions) {
    // return Schedule.update(scheduleDto, options);
  }

  async delete(options: DestroyOptions) {
    return Schedule.destroy(options);
  }

  /**
   * `repeat` 에 따라 일정 시간 계산
   */
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
