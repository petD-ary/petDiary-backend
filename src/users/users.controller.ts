import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { IdFromJwt } from 'src/middleware/middleware.id';
import { PetDto } from 'src/pets/dto/pet.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
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
  @Get('/')
  getProfile(@Req() req) {
    return req.user;
  }

  @Patch('/')
  async update(@IdFromJwt() id: string, @Body() userDto: UserDto) {
    return await this.usersService.update(id, userDto);
  }

  @Delete('/')
  async remove(@IdFromJwt() id: string) {
    return await this.usersService.delete(id);
  }
}
