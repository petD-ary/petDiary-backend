import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class RepeatDto {
  @IsString()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'repeat' })
  repeat: string;

  @IsNumber()
  @ApiProperty({ description: 'repeatCount' })
  repeatCount: number;
}

export const REPEAT = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};
export type REPEAT = (typeof REPEAT)[keyof typeof REPEAT];

export class RepeatDtoWithoutId extends OmitType(RepeatDto, ['id'] as const) {}
