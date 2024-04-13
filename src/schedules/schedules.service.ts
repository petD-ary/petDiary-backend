import { Injectable } from '@nestjs/common';
import {
  DestroyOptions,
  FindOptions,
  Op,
  Optional,
  UpdateOptions,
} from 'sequelize';
import { plainToInstance } from 'class-transformer';

import {
  CreateScheduleDtoWithUserId,
  REPEAT,
  SCHEDULE_EDIT_OPTIONS,
  ScheduleDto,
} from './dto/schedule.dto';
import { Schedule } from './entity/schedule.entity';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { ScheduleInstance } from './entity/scheduleInstance.entity';

interface ScheduleOptions extends FindOptions {
  userId?: string;
}

@Injectable()
export class SchedulesService {
  /**
   * 사용자가 정의한 반복 규칙(repeat, repeatCount)에 따라 일정 생성
   * - `repeat`와 `repeatCount`는 반복 규칙을 정의
   *    - `repeat`: 일정의 반복 유형을 정의 (반복 안함, 매일, 매주, 격주, 매월, 매년).
   *    - `repeatCount`: 일정이 반복되어야 하는 횟수를 정의.
   * - 반복 일정 중 인스턴스마다 달라지는 `startTime`, `endTime`, `repeatIndex`는 별도의
   * `scheduleInstance` 테이블에 저장되며, 각 반복 일정은 `scheduleId`로 연결
   * - `startTime`과 `endTime`은 Date 타입으로 변환하여 데이터베이스에 저장
   *    - 이는 일정을 기간으로 검색할 때 조회를 용이하게 하기 위함.
   */
  async createScheduleAndInstance(value: CreateScheduleDtoWithUserId) {
    const {
      userId,
      repeat,
      repeatCount = 1,
      startTime,
      endTime,
      ...schedule
    } = value;
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const scheduleId = (
      await this.createSchedule({ ...schedule, repeat, repeatCount })
    ).id;

    await this.createRepeatedScheduleInstances(
      userId,
      scheduleId,
      repeat,
      repeatCount,
      startDateTime,
      endDateTime,
    );

    return;
  }

  /**
   * `startTime`, `endTime`, `repeatIndex` 제외한 schedule 생성
   */
  async createSchedule(
    schedule: Optional<Schedule, NullishPropertiesOf<Schedule>>,
  ) {
    return await Schedule.create(schedule);
  }

  /**
   * `repeatCount` 만큼 반복 일정 인스턴스 생성
   */
  async createRepeatedScheduleInstances(
    userId: number,
    scheduleId: number,
    repeat: string,
    repeatCount: number,
    baseStartTime: Date,
    baseEndTime: Date,
  ) {
    for (let i = 0; i < repeatCount; i++) {
      const startTime = this.adjustDate(baseStartTime, repeat, i);
      const endTime = this.adjustDate(baseEndTime, repeat, i);

      await ScheduleInstance.create({
        userId,
        scheduleId,
        repeatIndex: i + 1,
        startTime,
        endTime,
      });
    }
  }

  async getById(id: number) {
    const scheduleEntity = await ScheduleInstance.scope('find').findOne({
      where: {
        id: id,
      },
    });

    return this.convertToDto<ScheduleInstance, ScheduleDto>(
      scheduleEntity,
      ScheduleDto,
    );
  }

  async getByUserId(userId: number) {
    const scheduleEntity = await ScheduleInstance.scope('findAll').findAll({
      where: {
        userId: userId,
      },
    });

    return this.convertToDto<ScheduleInstance[], ScheduleDto>(
      scheduleEntity,
      ScheduleDto,
    );
  }

  async getByAll(options: FindOptions) {
    const scheduleEntity =
      await ScheduleInstance.scope('findAll').findAll(options);

    return this.convertToDto<ScheduleInstance[], ScheduleDto>(
      scheduleEntity,
      ScheduleDto,
    );
  }

  async update(
    scheduleDto: ScheduleDto,
    options: UpdateOptions,
    editOptions: SCHEDULE_EDIT_OPTIONS,
  ) {
    const { id, startTime, endTime, ...scheduleDetails } = scheduleDto;
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    const schedule = await this.getById(id);

    // 반복 일정 중에 하나만 수정한다면 기존 instance 삭제 후 새로 schedule, instance 만든다.
    // 반복 일정에서 제외된 별개의 일정을 생성하기 위함.
    if (editOptions === SCHEDULE_EDIT_OPTIONS.ONLY_ONE) {
      await this.delete(options);
      delete scheduleDto.id;
      scheduleDto.repeat = REPEAT.NONE;
      scheduleDto.repeatCount = 1;
      scheduleDto.userId = schedule.userId;
      await this.createScheduleAndInstance(scheduleDto);
    }

    // 반복 일정이 아니므로 schedule, instance update
    if (editOptions === SCHEDULE_EDIT_OPTIONS.NONE) {
      await Schedule.update(scheduleDetails, {
        where: { id: schedule.scheduleId },
      });
      await ScheduleInstance.update(
        { startTime: startDateTime, endTime: endDateTime },
        options,
      );
    }

    // 반복 일정 전체 업데이트
    if (editOptions === SCHEDULE_EDIT_OPTIONS.ALL) {
      await Schedule.update(scheduleDetails, {
        where: { id: schedule.scheduleId },
      });
      // 시간 변경사항이 없다면 일정 인스턴스 업데이트는 안 해도 된다.
      if (schedule.startTime === startTime && schedule.endTime === endTime) {
        return;
      }
      const scheduleInstances = await this.getByAll({
        where: { scheduleId: schedule.scheduleId },
      });
      const baseStartTime = this.reverseAdjustDate(
        startDateTime,
        scheduleDto.repeat,
        schedule.repeatIndex,
      );
      const baseEndTime = this.reverseAdjustDate(
        endDateTime,
        scheduleDto.repeat,
        schedule.repeatIndex,
      );
      const updatePromises = (
        scheduleInstances as unknown as ScheduleDto[]
      ).map(async (v) => {
        const adjustedStartTime = this.adjustDate(
          baseStartTime,
          scheduleDto.repeat,
          v.repeatCount,
        );
        const adjustedEndTime = this.adjustDate(
          baseEndTime,
          scheduleDto.repeat,
          v.repeatCount,
        );
        return await ScheduleInstance.update(
          { startTime: adjustedStartTime, endTime: adjustedEndTime },
          { where: { id: v.id } },
        );
      });

      await Promise.all(updatePromises);
    }

    // 반복 일정 중 선택한 일정과 이후 일정 업데이트
    // 기존 instance 는 삭제 후, 새로 schedule, instance 만든다.
    if (editOptions === SCHEDULE_EDIT_OPTIONS.SINCE) {
      const newRepeatCount = schedule.repeatCount - schedule.repeatIndex + 1;
      const prevRepeatCount = schedule.repeatCount - newRepeatCount;
      await this.delete({
        where: {
          scheduleId: schedule.scheduleId,
          repeatIndex: { [Op.gte]: schedule.repeatIndex },
        },
      });
      await Schedule.update(
        { repeatCount: prevRepeatCount },
        {
          where: { id: schedule.scheduleId },
        },
      );
      delete scheduleDto.id;
      scheduleDto.repeatCount = newRepeatCount;
      scheduleDto.userId = schedule.userId;
      await this.createScheduleAndInstance(scheduleDto);
    }
  }

  async delete(options: DestroyOptions) {
    return ScheduleInstance.destroy(options);
  }

  /**
   * `repeat` 에 따라 일정 시간 계산
   */
  adjustDate(date: Date, repeat: REPEAT, count: number) {
    const newDate = new Date(date);
    switch (repeat) {
      case REPEAT.NONE:
        break;
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

  /**
   * `adjustDate` 의 역산.
   *
   * 일정 업데이트할 때 `repeatCount`, `repeat` 로 일정 시간 계산하기 위해 `originalDate`를 구함
   */
  reverseAdjustDate(newDate: Date, repeat: REPEAT, count: number): Date {
    const originalDate = new Date(newDate);
    switch (repeat) {
      case REPEAT.NONE:
        break;
      case REPEAT.DAILY:
        originalDate.setDate(newDate.getDate() - count);
        break;
      case REPEAT.WEEKLY:
        originalDate.setDate(newDate.getDate() - count * 7);
        break;
      case REPEAT.BIWEEKLY:
        originalDate.setDate(newDate.getDate() - count * 14);
        break;
      case REPEAT.MONTHLY:
        originalDate.setMonth(newDate.getMonth() - count);
        break;
      case REPEAT.YEARLY:
        originalDate.setFullYear(newDate.getFullYear() - count);
        break;
      default:
        throw new Error('Invalid repeat type');
    }
    return originalDate;
  }

  /**
   * 사용자 ID를 포함하는 기본 옵션 객체를 생성
   *
   * 시작(`from`) 및 종료(`to`) 날짜가 제공되면, 해당 날짜 범위에 맞는 일정을
   * 검색할 수 있도록 `where` 조건을 옵션에 추가
   *
   * @param userId
   * @param from 일정 검색을 시작할 날짜
   * @param to 일정 검색을 종료할 날짜
   * @returns {Promise<ScheduleOptions>} 일정 검색을 위한 옵션 객체를 반환
   */
  async createScheduleOptions(
    userId: string,
    from?: string,
    to?: string,
  ): Promise<ScheduleOptions> {
    let options: ScheduleOptions = {
      userId: userId,
    };

    if (from && to) {
      options = {
        ...options,
        where: {
          [Op.and]: [
            {
              startTime: {
                [Op.gte]: new Date(this.convertDateFormat(from)),
              },
            },
            {
              endTime: {
                [Op.lte]: new Date(this.convertDateFormat(to)),
              },
            },
          ],
        },
      };
    }

    return options;
  }

  /**
   * `YYYYMMDDTHHMMSSZ` -> `YYYY-MM-DDTHH:MM:SSZ`
   */
  convertDateFormat(dateTimeStr: string) {
    return dateTimeStr.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
      '$1-$2-$3T$4:$5:$6Z',
    );
  }

  /**
   * `plainToInstance` 를 사용해서 `Entity` 를 `Dto` 로 변환한다.
   *
   * `excludeExtraneousValues: true` 추가하고, `Dto` 에 `@Expose()` 데코레이터 추가하여
   * 명시된 필드만 객체를 직렬화하여 순환 참조 발생을 피한다.
   */
  convertToDto<T, V>(entity: T, dtoType: new () => V) {
    return plainToInstance(dtoType, entity, {
      excludeExtraneousValues: true,
    });
  }
}
