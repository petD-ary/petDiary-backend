import {
  Controller,
  Get,
  Body,
  Delete,
  UseGuards,
  Post,
  Param,
  Put,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetDto } from './dto/pet.dto';
import { AuthGuard } from '@nestjs/passport';
import { IdFromJwt } from 'src/middleware/middleware.id';

@Controller('users')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post('/')
  async create(@Body() petDto: PetDto) {
    return await this.petsService.create(petDto);
  }

  @Get('/')
  async getById(@Param('id') id: string) {
    return await this.petsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/')
  async update(@IdFromJwt() id: string, @Body() petDto: PetDto) {
    return await this.petsService.update(id, petDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/')
  async remove(@IdFromJwt() id: string) {
    return await this.petsService.delete(id);
  }
}
