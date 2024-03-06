import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

const CALENDAR_DTO_EXAMPLE = {
  ID: '1',
  TITLE: '네로 병원가기',
  ADDRESS: '히히 동물병원',
  LAT: 37.5222644,
  LNG: 127.0461,
  ALARM: '24h',
  REPEAT: 'weekly',
  START_TIME: '2024-05-05T10:00:00.000Z',
  FINISH_TIME: '2024-05-05T11:00:00.000Z',
  MEMO: '이건 메모입니다..',
};

export class CalendarDto {
  @IsString()
  userId: number;

  @IsString()
  @ApiProperty({ description: 'id', example: CALENDAR_DTO_EXAMPLE.ID })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title', example: CALENDAR_DTO_EXAMPLE.TITLE })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'address',
    example: CALENDAR_DTO_EXAMPLE.ADDRESS,
  })
  address: string;

  @IsNumber()
  @ApiProperty({ description: 'lat', example: CALENDAR_DTO_EXAMPLE.LAT })
  lat: number;

  @IsNumber()
  @ApiProperty({ description: 'lng', example: CALENDAR_DTO_EXAMPLE.LNG })
  lng: number;

  @IsString()
  @ApiProperty({ description: 'alarm', example: CALENDAR_DTO_EXAMPLE.ALARM })
  alarm: string;

  @IsString()
  @ApiProperty({ description: 'repeat', example: CALENDAR_DTO_EXAMPLE.REPEAT })
  repeat: string;

  @IsString()
  @ApiProperty({
    description: 'startTime',
    example: CALENDAR_DTO_EXAMPLE.START_TIME,
  })
  startTime: string;

  @IsString()
  @ApiProperty({
    description: 'finishTime',
    example: CALENDAR_DTO_EXAMPLE.FINISH_TIME,
  })
  finishTime: string;

  @IsString()
  @ApiProperty({ description: 'memo', example: CALENDAR_DTO_EXAMPLE.MEMO })
  memo: string;
}

export class CalendarDtoWithoutId extends OmitType(CalendarDto, [
  'id',
] as const) {}

export class CalendarDtoOnlyId extends PickType(CalendarDto, ['id'] as const) {}
