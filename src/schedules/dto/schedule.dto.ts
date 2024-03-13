import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
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
  @Expose()
  @IsNumber()
  userId: number;

  @Expose()
  @IsString()
  @ApiProperty({ description: 'id', example: SCHEDULE_DTO_EXAMPLE.ID })
  id: string;

  @Expose()
  @IsNumber()
  repeatId: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title', example: SCHEDULE_DTO_EXAMPLE.TITLE })
  title: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'address',
    example: SCHEDULE_DTO_EXAMPLE.ADDRESS,
  })
  address: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'lat', example: SCHEDULE_DTO_EXAMPLE.LAT })
  lat: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'lng', example: SCHEDULE_DTO_EXAMPLE.LNG })
  lng: number;

  @Expose()
  @IsString()
  @ApiProperty({ description: 'alarm', example: SCHEDULE_DTO_EXAMPLE.ALARM })
  alarm: string;

  @Expose()
  @Transform(({ obj }) => obj.repeatInfo?.repeat)
  @IsString()
  @ApiProperty({ description: 'repeat', example: SCHEDULE_DTO_EXAMPLE.REPEAT })
  repeat: string;

  @Expose()
  @Transform(({ obj }) => obj.repeatInfo?.repeatCount)
  @IsNumber()
  @ApiProperty({
    description: 'repeatCount',
    example: SCHEDULE_DTO_EXAMPLE.REPEAT_COUNT,
  })
  repeatCount: number;

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

  @Expose()
  @IsString()
  @ApiProperty({ description: 'memo', example: SCHEDULE_DTO_EXAMPLE.MEMO })
  memo: string;
}

export class ScheduleDtoWithoutId extends OmitType(ScheduleDto, [
  'id',
] as const) {}

export class ScheduleDtoOnlyId extends PickType(ScheduleDto, ['id'] as const) {}
