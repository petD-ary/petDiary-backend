import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PetDto {
  @IsString()
  userId: number;

  @IsString()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'petType' })
  petType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'breed' })
  breed: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'gender' })
  gender: string;

  @IsBoolean()
  @ApiProperty({ description: 'neutered' })
  neutered: boolean;

  @IsString()
  @ApiProperty({ description: 'birthday' })
  birthday: string;

  @IsString()
  @ApiProperty({ description: 'adoptionDate' })
  adoptionDate: string;

  @IsString()
  @ApiProperty({ description: 'weight' })
  weight: string;

  @IsString()
  @ApiProperty({ description: 'imageUrl' })
  imageUrl: string;
}

export class PetDtoWithoutId extends OmitType(PetDto, ['id'] as const) {}
