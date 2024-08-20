import {
  Controller,
  Get,
  Body,
  UseGuards,
  Post,
  Req,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoginUserDto, UpdateNicknameDto, UserInfoDto } from './dto/user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '회원가입',
    description:
      '서비스에서는 사라진 기능이지만 테스트를 위해 편히 유저 생성할 수 있게 남겨둠.',
  })
  @Post('/signup')
  async create(@Body() userDto: LoginUserDto) {
    return await this.usersService.createNormalUser(userDto);
  }

  @ApiOperation({
    summary: '로그인',
    description:
      '서비스에서는 사라진 기능이지만 테스트를 위해 편히 로그인할 수 있게 남겨둠.',
  })
  @Post('/login')
  async login(@Body() userDto: LoginUserDto) {
    return await this.usersService.normalLogin(userDto);
  }

  @ApiOperation({
    summary: '회원가입 시 추가 정보',
    description: '닉네임 및 반려 동물 정보 추가 필요',
  })
  @UseGuards(AuthGuard)
  @Post('/info')
  async addInfo(@Req() req, @Body() body: UserInfoDto) {
    return await this.usersService.addInfo(req.user, body);
  }

  @ApiOperation({
    summary: '사용자 정보',
  })
  @UseGuards(AuthGuard)
  @Get('/')
  async getByEmailAndProvider(@Req() req) {
    return await this.usersService.getByEmailAndProvider(req.user);
  }

  @ApiOperation({
    summary: '닉네임 중복 체크',
  })
  @Get('/nicknames/:nickname/exists')
  async checkNicknameExists(@Param('nickname') nickname: string) {
    const user = await this.usersService.getByNickname(nickname);

    if (user) {
      return {
        message: '나도 사랑해❤',
      };
    }
    return;
  }

  @ApiOperation({
    summary: '닉네임 변경',
  })
  @UseGuards(AuthGuard)
  @Put('/nickname')
  async updateNickname(
    @Req() req,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ) {
    const { nickname } = updateNicknameDto;
    const user = await this.usersService.getByNickname(nickname);

    if (user) {
      return {
        message: '이미 등록되어 있는 닉네임입니다.',
      };
    }

    await this.usersService.update({ nickname }, req.user);
    return;
  }
}
