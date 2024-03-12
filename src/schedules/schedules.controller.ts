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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    return await this.schedulesService.create(schedule);
  }

  @ApiOperation({
    summary: '일정 보기',
  })
  @UseGuards(AuthGuard)
  @Get('/')
  async get(@Req() req) {
    return await this.schedulesService.getByUserId(req.user.id);
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
