import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

const SCHEDULE_DTO_EXAMPLE = {
  ID: '1',
  USER_ID: 2,
  SCHEDULE_ID: 3,
  TITLE: '네로 병원가기',
  PLACE: '히히 동물병원',
  ADDRESS: '서울 강남구 도산대로78길 32 1층1호',
  LAT: 37.5222644,
  LNG: 127.0461,
  ALARM: '24h',
  REPEAT: 'weekly',
  REPEAT_COUNT: 5,
  START_TIME: '2024-05-05T10:00:00.000Z',
  END_TIME: '2024-05-05T11:00:00.000Z',
  MEMO: '이건 메모입니다..',
};

export class ScheduleDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'id', example: SCHEDULE_DTO_EXAMPLE.ID })
  id: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'userId', example: SCHEDULE_DTO_EXAMPLE.USER_ID })
  userId: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    description: 'scheduleId',
    example: SCHEDULE_DTO_EXAMPLE.SCHEDULE_ID,
  })
  scheduleId: number;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.title)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title', example: SCHEDULE_DTO_EXAMPLE.TITLE })
  title: string;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.place)
  @IsString()
  @ApiProperty({
    description: 'place',
    example: SCHEDULE_DTO_EXAMPLE.PLACE,
  })
  place: string;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.address)
  @IsString()
  @ApiProperty({
    description: 'address',
    example: SCHEDULE_DTO_EXAMPLE.ADDRESS,
  })
  address: string;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.lat)
  @IsNumber()
  @ApiProperty({ description: 'lat', example: SCHEDULE_DTO_EXAMPLE.LAT })
  lat: number;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.lng)
  @IsNumber()
  @ApiProperty({ description: 'lng', example: SCHEDULE_DTO_EXAMPLE.LNG })
  lng: number;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.alarm)
  @IsString()
  @ApiProperty({ description: 'alarm', example: SCHEDULE_DTO_EXAMPLE.ALARM })
  alarm: string;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.repeat)
  @IsString()
  @ApiProperty({
    description: 'repeat(none, daily, weekly, biweekly, monthly, yearly)',
    example: SCHEDULE_DTO_EXAMPLE.REPEAT,
  })
  repeat: string;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.repeatCount)
  @IsNumber()
  @ApiProperty({
    description: 'repeatCount',
    example: SCHEDULE_DTO_EXAMPLE.REPEAT_COUNT,
  })
  repeatCount: number;

  @Expose()
  @IsNumber()
  repeatIndex: number;

  @Expose()
  @Transform(({ obj }) => obj.scheduleInfo?.memo)
  @IsString()
  @ApiProperty({ description: 'memo', example: SCHEDULE_DTO_EXAMPLE.MEMO })
  memo: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'startTime',
    example: SCHEDULE_DTO_EXAMPLE.START_TIME,
  })
  startTime: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'endTime',
    example: SCHEDULE_DTO_EXAMPLE.END_TIME,
  })
  endTime: string;
}

export const SCHEDULE_EDIT_OPTIONS = {
  ALL: 'all',
  ONLY_ONE: 'onlyOne',
  SINCE: 'since',
  NONE: 'none',
};
export type SCHEDULE_EDIT_OPTIONS =
  (typeof SCHEDULE_EDIT_OPTIONS)[keyof typeof SCHEDULE_EDIT_OPTIONS];

export const REPEAT = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};
export type REPEAT = (typeof REPEAT)[keyof typeof REPEAT];

export class ScheduleDtoWithoutId extends OmitType(ScheduleDto, [
  'id',
] as const) {}

export class CreateScheduleDto extends OmitType(ScheduleDto, [
  'id',
  'userId',
  'scheduleId',
] as const) {}

export class CreateScheduleDtoWithUserId extends OmitType(ScheduleDto, [
  'id',
  'scheduleId',
] as const) {}

export class ScheduleDtoOnlyId extends PickType(ScheduleDto, ['id'] as const) {}
