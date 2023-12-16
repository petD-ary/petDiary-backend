import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  provider: string;

  @IsString()
  status: string;
}
