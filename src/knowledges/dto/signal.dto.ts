import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

const signalDtoExample = {
  id: 1,
  type: 'drinkAmount',
  title: { 발달단계: '유년기' },
  summery: {
    안내: '음수량이 부족해 보임. 잇몸이 말랐거나 피부 탄력도가 떨어져 피부를 늘려보아도 바로 돌아가지 않는지 살펴봐야 함. 수시로 물을 섭취할 수 있도록 해주시고 특히 식욕저하를 보인다면 빠른 병원 검진을 권장함. 평소 물을 잘 먹지 않는 경우, 건사료 대신 수분 함유량이 많은 캔, 파우치 형태의 음식을 대체하여 음수량을 높일 수 있는 방안이 필요함.',
  },
  content: [
    { '권장 음수량': '하루 최소 30ml' },
    { '측정 방법': '반려동물 몸무게(kg) * 50ml' },
    {
      '건사료일 경우':
        '10%의 수분을 함유하고 있음. 건사료를 주식으로 하는 고양이들은 반드시 물을 마셔야 함.',
    },
    {
      '캔사료일 경우':
        '74%의 수분을 함유하고 있음. 캔사료를 주식으로 하는 고양이들은 음식으로 수분이 대부분 보충되어 따로 물을 마시지 않을 수도 있음.',
    },
    { 음수량: '부족' },
  ],
  tag: [{ '반려동물 타입': '고양이' }],
};

export class SignalDto {
  @IsNumber()
  @ApiProperty({ description: 'id', example: signalDtoExample.id })
  id: number;

  @IsString()
  @ApiProperty({ description: 'type', example: signalDtoExample.type })
  type: string;

  @ApiProperty({ description: 'title', example: signalDtoExample.title })
  title: object;

  @ApiProperty({ description: 'summery', example: signalDtoExample.summery })
  summery: object;

  @ApiProperty({ description: 'content', example: signalDtoExample.content })
  content: object;

  @ApiProperty({ description: 'tag', example: signalDtoExample.tag })
  tag: object;
}

export class SignalDtoWithoutId extends OmitType(SignalDto, ['id'] as const) {}

export class SignalDtoOnlyId extends PickType(SignalDto, ['id'] as const) {}
