import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SymptomDto {
  @IsNumber()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsString()
  @ApiProperty({ description: 'symptom' })
  symptom: string;
}

export class SymptomDtoWithoutId extends OmitType(SymptomDto, [
  'id',
] as const) {}

export class SymptomDtoOnlyId extends PickType(SymptomDto, ['id'] as const) {}
