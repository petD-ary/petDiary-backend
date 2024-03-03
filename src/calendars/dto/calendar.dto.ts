import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CalendarDto {
  @IsString()
  userId: number;

  @IsString()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'address' })
  address: string;

  @IsString()
  @ApiProperty({ description: 'lat' })
  lat: string;

  @IsString()
  @ApiProperty({ description: 'lng' })
  lng: string;

  @IsString()
  @ApiProperty({ description: 'alarm' })
  alarm: string;

  @IsString()
  @ApiProperty({ description: 'repeat' })
  repeat: string;

  @IsString()
  @ApiProperty({ description: 'startTime' })
  startTime: string;

  @IsString()
  @ApiProperty({ description: 'finishTime' })
  finishTime: string;

  @IsString()
  @ApiProperty({ description: 'memo' })
  memo: string;
}

export class CalendarDtoWithoutId extends OmitType(CalendarDto, [
  'id',
] as const) {}
