import { IsNotEmpty, IsString } from 'class-validator';
import { STATUS } from '../entity/user.entity';

export class UserDto {
  @IsString()
  id?: string;

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
  status: STATUS;
}
