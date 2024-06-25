import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SignalsService } from './signals.service';
import {
  SignalDtoWithoutId,
  SignalDto,
  SignalDtoOnlyId,
} from './dto/signal.dto';

@Controller('knowledges')
@ApiTags('knowledges')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @ApiOperation({
    summary: '행동 신호 정보 추가',
  })
  @Post('/signal/:type')
  async create(
    @Param('type') type: string,
    @Body() signal: SignalDtoWithoutId,
  ) {
    signal['type'] = type;
    return await this.signalsService.create(signal);
  }

  @ApiOperation({
    summary: '행동 신호 정보 추가(배열)',
  })
  @ApiBody({ type: [SignalDtoWithoutId] })
  @Post('/signal/:type/all')
  async createAll(
    @Param('type') type: string,
    @Body() signals: SignalDtoWithoutId[],
  ) {
    if (!Array.isArray(signals)) {
      throw new BadRequestException('Body must be an array.');
    }

    // signals 배열 안의 각 객체에 type 값 추가
    const signalsWithType = signals.map((signal) => ({
      ...signal,
      type,
    }));
    return await this.signalsService.createAll(signalsWithType);
  }

  @ApiOperation({
    summary: '행동 신호 정보',
  })
  @Get('/signal/:type')
  async get(@Param('type') type: string) {
    const options = {
      where: {
        type,
      },
    };

    return await this.signalsService.getByAll(options);
  }

  @ApiOperation({
    summary: '행동 신호 정보 업데이트',
  })
  @Put('/signal')
  async put(@Body() signal: SignalDto) {
    const options = {
      where: {
        id: signal.id,
      },
    };

    return await this.signalsService.update(signal, options);
  }

  @ApiOperation({
    summary: '행동 신호 정보 삭제',
  })
  @Delete('/signal')
  async delete(@Body() signal: SignalDtoOnlyId) {
    const options = {
      where: {
        id: signal.id,
      },
    };

    return await this.signalsService.delete(options);
  }
}
