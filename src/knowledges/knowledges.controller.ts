import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { KnowledgesService } from './knowledges.service';
import {
  DiseaseDto,
  DiseaseDtoOnlyId,
  DiseaseDtoWithoutId,
} from './dto/disease.dto';

@Controller('knowledges')
@ApiTags('knowledges')
export class KnowledgesController {
  constructor(private readonly knowledgesService: KnowledgesService) {}

  @ApiOperation({
    summary: '질병 사전 추가',
  })
  @Post('/disease')
  async create(@Body() disease: DiseaseDtoWithoutId) {
    return await this.knowledgesService.create(disease);
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

    return await this.knowledgesService.createAll(diseases);
  }

  @ApiOperation({
    summary: '질병 사전',
  })
  @Get('/disease')
  async get() {
    return await this.knowledgesService.getByAll();
  }

  @ApiOperation({
    summary: '질병 사전 업데이트',
  })
  @Put('/disease')
  async put(@Body() disease: DiseaseDto) {
    return await this.knowledgesService.updateDiseaseWithSymptoms(
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

    return await this.knowledgesService.delete(options);
  }
}
