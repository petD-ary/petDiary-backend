import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Post,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { IdFromJwt } from 'src/middleware/middleware.id';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async create(@Body() userDto: UserDto) {
    return await this.usersService.create(userDto);
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.usersService.getById(id);
  }

  @Get('/')
  async getByAll() {
    return await this.usersService.getByAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/')
  async update(@IdFromJwt() id: number, @Body() userDto: UserDto) {
    return await this.usersService.update(id, userDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/')
  async remove(@IdFromJwt() id: number) {
    return await this.usersService.remove(id);
  }
}
