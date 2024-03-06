import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

const PET_DTO_EXAMPLE = {
  ID: '1',
  PET_TYPE: '고양이',
  BREED: '노르웨이숲',
  NAME: '네로',
  GENDER: '남아',
  NEUTERED: false,
  BIRTHDAY: '2023-05-05T10:00:00.000Z',
  ADOPTION_DATE: '2023-05-05T10:00:00.000Z',
  WEIGHT: '4',
  IMAGE_URL:
    'https://petdiary-bucket.s3.ap-southeast-2.amazonaws.com/images/1709382302035Frame+12863.jpg',
};

export class PetDto {
  @IsString()
  userId: number;

  @IsString()
  @ApiProperty({ description: 'id', example: PET_DTO_EXAMPLE.ID })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'petType', example: PET_DTO_EXAMPLE.PET_TYPE })
  petType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'breed', example: PET_DTO_EXAMPLE.BREED })
  breed: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name', example: PET_DTO_EXAMPLE.NAME })
  name: string;

  @IsString()
  @ApiProperty({ description: 'gender', example: PET_DTO_EXAMPLE.GENDER })
  gender: string;

  @IsBoolean()
  @ApiProperty({ description: 'neutered', example: PET_DTO_EXAMPLE.NEUTERED })
  neutered: boolean;

  @IsString()
  @ApiProperty({ description: 'birthday', example: PET_DTO_EXAMPLE.BIRTHDAY })
  birthday: string;

  @IsString()
  @ApiProperty({
    description: 'adoptionDate',
    example: PET_DTO_EXAMPLE.ADOPTION_DATE,
  })
  adoptionDate: string;

  @IsString()
  @ApiProperty({ description: 'weight', example: PET_DTO_EXAMPLE.WEIGHT })
  weight: string;

  @IsString()
  @ApiProperty({ description: 'imageUrl', example: PET_DTO_EXAMPLE.IMAGE_URL })
  imageUrl: string;
}

export class PetDtoWithoutId extends OmitType(PetDto, ['id'] as const) {}

export class PetDtoOnlyId extends PickType(PetDto, ['id'] as const) {}
