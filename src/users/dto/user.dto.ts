import { IsNotEmpty, IsString } from 'class-validator';
import { STATUS } from '../entity/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { PetDto } from 'src/pets/dto/pet.dto';

const USER_DTO_EXAMPLE = {
  ID: '1',
  NICKNAME: '네로집사',
  EMAIL: 'example@mail.com',
  PASSWORD: 'password123!',
};

export class UserDto {
  @IsString()
  id?: string;

  @IsString()
  @ApiProperty({ description: 'nickname', example: USER_DTO_EXAMPLE.NICKNAME })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'email', example: USER_DTO_EXAMPLE.EMAIL })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password', example: USER_DTO_EXAMPLE.PASSWORD })
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
