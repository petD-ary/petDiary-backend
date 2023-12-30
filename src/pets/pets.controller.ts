import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PetsService } from './pets.service';
import { catBreeds } from './data/breeds/cats';
import { dogBreeds } from './data/breeds/dogs';

@Controller('pets')
@ApiTags('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @ApiOperation({
    summary: '고양이 품종',
  })
  @Get('/breeds/cats')
  async getCatBreeds() {
    return catBreeds;
  }

  @ApiOperation({
    summary: '개 품종',
  })
  @Get('/breeds/dogs')
  async getDogBreeds() {
    return dogBreeds;
  }
}
