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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async create(@Body() userDto: UserDto) {
    return await this.usersService.create(userDto);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.usersService.getById(id);
  }

  @Get('/')
  async getByAll() {
    return await this.usersService.getByAll();
  }

  @Post('/login')
  async login(@Body() userDto: UserDto) {
    return await this.usersService.login(userDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/')
  async update(@IdFromJwt() id: string, @Body() userDto: UserDto) {
    return await this.usersService.update(id, userDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/')
  async remove(@IdFromJwt() id: string) {
    return await this.usersService.delete(id);
  }
}
