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

import { FoodsService } from './foods.service';
import { FoodDtoWithoutId, FoodDto, FoodDtoOnlyId } from './dto/food.dto';

@Controller('knowledges')
@ApiTags('knowledges/food')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @ApiOperation({
    summary: '안심 음식 / 위험 음식 정보 추가',
  })
  @Post('/food/:type')
  async create(@Param('type') type: string, @Body() food: FoodDtoWithoutId) {
    food['type'] = type;
    return await this.foodsService.create(food);
  }

  @ApiOperation({
    summary: '안심 음식 / 위험 음식 정보 추가(배열)',
  })
  @ApiBody({ type: [FoodDtoWithoutId] })
  @Post('/food/:type/all')
  async createAll(
    @Param('type') type: string,
    @Body() foods: FoodDtoWithoutId[],
  ) {
    if (!Array.isArray(foods)) {
      throw new BadRequestException('Body must be an array.');
    }

    // foods 배열 안의 각 객체에 type 값 추가
    const foodsWithType = foods.map((food) => ({
      ...food,
      type,
    }));
    return await this.foodsService.createAll(foodsWithType);
  }

  @ApiOperation({
    summary: '안심 음식 / 위험 음식 정보',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: '종류(safeFood, dangerousFood)',
    example: 'safeFood',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: '검색어',
    example: '비타민A',
  })
  @ApiQuery({
    name: 'foodCookType',
    required: false,
    type: String,
    description: '조리 종류(cooking, preparation)',
    example: 'preparation',
  })
  @Get('/food')
  async get(@Req() req) {
    const { type, search, foodCookType } = req.query;
    const options = this.foodsService.createFoodOptions(
      type,
      search,
      foodCookType,
    );

    return await this.foodsService.getByAll(options);
  }

  @ApiOperation({
    summary: '안심 음식 / 위험 음식 정보 상세',
  })
  @Get('/food/:id')
  async getById(@Param('id') id: string) {
    const options = {
      where: {
        id,
      },
    };

    return await this.foodsService.getBy(options);
  }

  @ApiOperation({
    summary: '안심 음식 / 위험 음식 정보 업데이트',
  })
  @Put('/food')
  async put(@Body() food: FoodDto) {
    const options = {
      where: {
        id: food.id,
      },
    };

    return await this.foodsService.update(food, options);
  }

  @ApiOperation({
    summary: '안심 음식 / 위험 음식 정보 삭제',
  })
  @Delete('/food')
  async delete(@Body() food: FoodDtoOnlyId) {
    const options = {
      where: {
        id: food.id,
      },
    };

    return await this.foodsService.delete(options);
  }
}
