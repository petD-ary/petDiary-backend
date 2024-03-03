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
import { CalendarsService } from './calendars.service';
import { CalendarDto, CalendarDtoWithoutId } from './dto/calendar.dto';

@Controller('calendars')
@ApiTags('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @ApiOperation({
    summary: '일정 추가',
  })
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Req() req, @Body() calendar: CalendarDtoWithoutId) {
    calendar['userId'] = req.user.id;
    return await this.calendarsService.create(calendar);
  }

  @ApiOperation({
    summary: '일정 보기',
  })
  @UseGuards(AuthGuard)
  @Get('/')
  async get(@Req() req) {
    return await this.calendarsService.getByUserId(req.user.id);
  }

  @ApiOperation({
    summary: '일정 업데이트',
  })
  @UseGuards(AuthGuard)
  @Put('/')
  async put(@Req() req, @Body() calendar: CalendarDto) {
    return await this.calendarsService.update(calendar.id, calendar);
  }

  @ApiOperation({
    summary: '일정 삭제',
  })
  @UseGuards(AuthGuard)
  @Delete('/')
  async delete(@Req() req, @Body() calendar: CalendarDto) {
    return await this.calendarsService.delete(calendar.id);
  }
}
