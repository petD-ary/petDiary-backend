import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/auth/auth.guard';
import { PetsService } from './pets.service';
import { catBreeds } from './data/breeds/cats';
import { dogBreeds } from './data/breeds/dogs';
import { PetDto, PetDtoWithoutId } from './dto/pet.dto';
import { UploadsService } from 'src/uploads/uploads.service';

@Controller('pets')
@ApiTags('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @ApiOperation({
    summary: '반려 동물 정보 추가',
  })
  @UseGuards(AuthGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Req() req, @Body() pet: PetDtoWithoutId, @UploadedFile() file) {
    if (file) {
      const key = await this.uploadsService.uploadImage(file);
      const imageUrl = process.env.AWS_BUCKET_ADDRESS + key;
      pet['imageUrl'] = imageUrl;
    }

    pet['userId'] = req.user.id;
    return await this.petsService.create(pet);
  }

  @ApiOperation({
    summary: '반려 동물 정보',
  })
  @UseGuards(AuthGuard)
  @Get('/')
  async get(@Req() req) {
    return await this.petsService.getByUserId(req.user.id);
  }

  @ApiOperation({
    summary: '반려 동물 정보 업데이트',
  })
  @UseGuards(AuthGuard)
  @Put('/')
  @UseInterceptors(FileInterceptor('file'))
  async put(@Req() req, @Body() pet: PetDto, @UploadedFile() file) {
    if (file) {
      const key = await this.uploadsService.uploadImage(file);
      const imageUrl = process.env.AWS_BUCKET_ADDRESS + key;
      pet['imageUrl'] = imageUrl;
    }

    return await this.petsService.update(pet.id, pet);
  }

  @ApiOperation({
    summary: '반려 동물 정보 삭제',
  })
  @UseGuards(AuthGuard)
  @Delete('/')
  async delete(@Req() req, @Body() pet: PetDto) {
    return await this.petsService.delete(pet.id);
  }

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
