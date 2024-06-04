import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { DiseasesService } from './diseases.service';
import {
  DiseaseDto,
  DiseaseDtoOnlyId,
  DiseaseDtoWithoutId,
} from './dto/disease.dto';

@Controller('knowledges')
@ApiTags('knowledges')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @ApiOperation({
    summary: '질병 사전 추가',
  })
  @Post('/disease')
  async create(@Body() disease: DiseaseDtoWithoutId) {
    return await this.diseasesService.create(disease);
  }

  @ApiOperation({
    summary: '질병 사전 추가(배열)',
  })
  @ApiBody({ type: [DiseaseDtoWithoutId] })
  @Post('/disease/all')
  async createAll(@Body() diseases: DiseaseDtoWithoutId[]) {
    if (!Array.isArray(diseases)) {
      throw new BadRequestException('Body must be an array.');
    }

    return await this.diseasesService.createAll(diseases);
  }

  @ApiOperation({
    summary: '질병 사전',
  })
  @ApiQuery({
    name: 'petType',
    required: false,
    type: String,
    description: '펫 타입',
    example: 'cat',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: '정렬 방식',
    example: 'riskLevel,high',
  })
  @Get('/disease')
  async get(@Req() req) {
    const { petType, sort } = req.query;
    const options = {};
    const order = this.diseasesService.createSortOrder(sort);
    if (petType) {
      options['where'] = {
        petType: petType,
      };
    }
    options['order'] = order;

    return await this.diseasesService.getByAll(options);
  }

  @ApiOperation({
    summary: '질병 사전 상세',
  })
  @Get('/disease/:id')
  async getById(@Param('id') id: string) {
    const options = {
      where: {
        id: id,
      },
    };
    return await this.diseasesService.getBy(options);
  }

  @ApiOperation({
    summary: '질병 사전 업데이트',
  })
  @Put('/disease')
  async put(@Body() disease: DiseaseDto) {
    return await this.diseasesService.updateDiseaseWithSymptoms(
      disease.id,
      disease,
    );
  }

  @ApiOperation({
    summary: '질병 사전 삭제',
  })
  @Delete('/disease')
  async delete(@Body() disease: DiseaseDtoOnlyId) {
    const options = {
      where: {
        id: disease.id,
      },
    };

    return await this.diseasesService.delete(options);
  }
}
