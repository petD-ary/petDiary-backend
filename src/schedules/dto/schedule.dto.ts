import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

const SCHEDULE_DTO_EXAMPLE = {
  ID: '1',
  TITLE: '네로 병원가기',
  ADDRESS: '히히 동물병원',
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
  @IsNumber()
  userId: number;

  @IsString()
  @ApiProperty({ description: 'id', example: SCHEDULE_DTO_EXAMPLE.ID })
  id: string;

  @IsNumber()
  repeatId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title', example: SCHEDULE_DTO_EXAMPLE.TITLE })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'address',
    example: SCHEDULE_DTO_EXAMPLE.ADDRESS,
  })
  address: string;

  @IsNumber()
  @ApiProperty({ description: 'lat', example: SCHEDULE_DTO_EXAMPLE.LAT })
  lat: number;

  @IsNumber()
  @ApiProperty({ description: 'lng', example: SCHEDULE_DTO_EXAMPLE.LNG })
  lng: number;

  @IsString()
  @ApiProperty({ description: 'alarm', example: SCHEDULE_DTO_EXAMPLE.ALARM })
  alarm: string;

  @IsString()
  @ApiProperty({ description: 'repeat', example: SCHEDULE_DTO_EXAMPLE.REPEAT })
  repeat: string;

  @IsNumber()
  @ApiProperty({
    description: 'repeatCount',
    example: SCHEDULE_DTO_EXAMPLE.REPEAT_COUNT,
  })
  repeatCount: number;

  @IsString()
  @ApiProperty({
    description: 'startTime',
    example: SCHEDULE_DTO_EXAMPLE.START_TIME,
  })
  startTime: string;

  @IsString()
  @ApiProperty({
    description: 'endTime',
    example: SCHEDULE_DTO_EXAMPLE.END_TIME,
  })
  endTime: string;

  @IsString()
  @ApiProperty({ description: 'memo', example: SCHEDULE_DTO_EXAMPLE.MEMO })
  memo: string;
}

export class ScheduleDtoWithoutId extends OmitType(ScheduleDto, [
  'id',
] as const) {}

export class ScheduleDtoOnlyId extends PickType(ScheduleDto, ['id'] as const) {}
