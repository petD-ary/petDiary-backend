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
  ScheduleDto,
  ScheduleDtoOnlyId,
  ScheduleDtoWithoutId,
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
  async create(@Req() req, @Body() schedule: ScheduleDtoWithoutId) {
    schedule['userId'] = req.user.id;
    return await this.schedulesService.createSchedule(schedule);
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
  @UseGuards(AuthGuard)
  @Put('/')
  async put(@Req() req, @Body() schedule: ScheduleDto) {
    const options = {
      where: {
        id: schedule.id,
        userId: req.user.id,
      },
    };

    return await this.schedulesService.update(schedule, options);
  }

  @ApiOperation({
    summary: '일정 삭제',
  })
  @UseGuards(AuthGuard)
  @Delete('/')
  async delete(@Req() req, @Body() schedule: ScheduleDtoOnlyId) {
    const options = {
      where: {
        id: schedule.id,
        userId: req.user.id,
      },
    };

    return await this.schedulesService.delete(options);
  }
}
