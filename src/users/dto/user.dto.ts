import { IsNotEmpty, IsString } from 'class-validator';
import { STATUS } from '../entity/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PetDto } from 'src/pets/dto/pet.dto';

export class UserDto {
  @IsString()
  id?: string;

  @IsString()
  @ApiProperty({ description: 'nickname' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password' })
  password: string;

  @IsString()
  @ApiProperty({ description: 'provider' })
  provider: string;

  @IsString()
  @ApiProperty({ description: 'status' })
  status: STATUS;
}

export const PROVIDER = {
  KAKAO: 'kakao',
  NAVER: 'naver',
  GOOGLE: 'google',
  PET_DIARY: 'petDiary',
};
export type PROVIDER = (typeof PROVIDER)[keyof typeof PROVIDER];

export class LoginUserDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}

class UserInfo extends PickType(UserDto, ['nickname'] as const) {}

export class UserInfoDto {
  @ApiProperty({ description: 'user' })
  user: UserInfo;
  @ApiProperty({ description: 'pet' })
  pet: PetDto;
}
