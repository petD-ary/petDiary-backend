import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';
import { SchedulesService } from './schedules.service';
import {
  CreateScheduleDto,
  CreateScheduleDtoWithUserId,
  ScheduleDto,
  ScheduleDtoOnlyId,
} from './dto/schedule.dto';

@Controller('schedules')
@ApiTags('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @ApiOperation({
    summary: '일정 추가',
  })
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Req() req, @Body() schedule: CreateScheduleDto) {
    const scheduleDtoWithoutId: CreateScheduleDtoWithUserId = {
      ...schedule,
      userId: req.user.id,
    };
    return await this.schedulesService.createScheduleAndInstance(
      scheduleDtoWithoutId,
    );
  }

  @ApiOperation({
    summary: '일정 보기',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: '종료 날짜',
    example: '20240601T000000Z',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: '시작 날짜',
    example: '20240501T000000Z',
  })
  @UseGuards(AuthGuard)
  @Get('/')
  async get(@Req() req) {
    const { from, to } = req.query;
    const userId = req.user.id;
    const options = await this.schedulesService.createScheduleOptions(
      userId,
      from,
      to,
    );

    return await this.schedulesService.getByAll(options);
  }

  @ApiOperation({
    summary: '일정 업데이트',
  })
  @ApiQuery({
    name: 'editOptions',
    required: false,
    type: String,
    description: '업데이트 옵션',
    example: 'onlyOne',
  })
  @UseGuards(AuthGuard)
  @Put('/')
  async put(@Req() req, @Body() schedule: ScheduleDto) {
    const { editOptions } = req.query;
    const options = {
      where: {
        id: schedule.id,
        userId: req.user.id,
      },
    };

    return await this.schedulesService.update(schedule, options, editOptions);
  }

  @ApiOperation({
    summary: '일정 삭제',
  })
  @ApiQuery({
    name: 'editOptions',
    required: false,
    type: String,
    description: '삭제 옵션',
    example: 'onlyOne',
  })
  @UseGuards(AuthGuard)
  @Delete('/')
  async delete(@Req() req, @Body() schedule: ScheduleDtoOnlyId) {
    const { editOptions } = req.query;

    return await this.schedulesService.deleteWithEditOptions(
      schedule.id,
      req.user.id,
      editOptions,
    );
  }
}
