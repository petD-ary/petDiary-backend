import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

const foodDtoExample = {
  id: 1,
  type: 'safeFood',
  title: { 음식명: '감자' },
  summery: {
    영양소: '비타민C, 칼륨',
  },
  petType: 'cat,dog',
  tag: [{ cookedOrNot: '필수' }],
};

export class FoodDto {
  @IsNumber()
  @ApiProperty({ description: 'id', example: foodDtoExample.id })
  id: number;

  @IsString()
  @ApiProperty({ description: 'type', example: foodDtoExample.type })
  type: string;

  @ApiProperty({ description: 'title', example: foodDtoExample.title })
  title: object;

  @ApiProperty({ description: 'summery', example: foodDtoExample.summery })
  summery: object;

  @ApiProperty({ description: 'petType', example: foodDtoExample.petType })
  petType: string;

  @ApiProperty({ description: 'tag', example: foodDtoExample.tag })
  tag: object;
}

export class FoodDtoWithoutId extends OmitType(FoodDto, ['id'] as const) {}

export class FoodDtoOnlyId extends PickType(FoodDto, ['id'] as const) {}
