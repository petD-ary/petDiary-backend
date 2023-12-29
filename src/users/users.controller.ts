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
  @Post('/info')
  async addInfo(@Req() req, @Body() body: { user: UserDto; pet: PetDto }) {
    return await this.usersService.addInfo(req.user, body);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getByEmailAndProvider(@Req() req) {
    return await this.usersService.getByEmailAndProvider(req.user);
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
