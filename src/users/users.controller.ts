import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Post,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { IdFromJwt } from 'src/middleware/middleware.id';
import { PetDto } from 'src/pets/dto/pet.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async create(@Body() body: { user: UserDto; pet: PetDto }) {
    return await this.usersService.create(body);
  }

  @Post('/login')
  async login(@Body() userDto: UserDto) {
    return await this.usersService.login(userDto);
  }

  @UseGuards(AuthGuard)
  @Post('/info')
  async addInfo(@Req() req, @Body() body: { user: UserDto; pet: PetDto }) {
    return await this.usersService.addInfo(req.user, body);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getByEmailAndProvider(@Req() req) {
    return await this.usersService.getByEmailAndProvider(req.user);
  }

  @Get('/nicknames/:nickname/exists')
  async checkNicknameExists(@Param('nickname') nickname: string) {
    const user = await this.usersService.getByNickname(nickname);

    if (user) {
      return {
        message: '나도 사랑해❤',
      };
    }
    return;
  }

  @Patch('/')
  async update(@Body() userDto: UserDto) {
    return await this.usersService.update(userDto, userDto);
  }

  @Delete('/')
  async remove(@IdFromJwt() id: string) {
    return await this.usersService.delete(id);
  }
}
