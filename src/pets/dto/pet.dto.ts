import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PetDto {
  @IsString()
  userId: number;

  @IsString()
  @IsNotEmpty()
  petType: string;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  gender: string;

  @IsBoolean()
  neutered: boolean;

  @IsBoolean()
  @IsNotEmpty()
  birthday: string;

  @IsBoolean()
  adoptionDate: string;

  @IsBoolean()
  weight: string;
}
