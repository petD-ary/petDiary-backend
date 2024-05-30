import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SymptomDto } from './symptom.dto';

const diseaseDtoExample = {
  id: 1,
  diagnosisName: '난청',
  summary:
    '외이염, 중이염 등의 감염이 내이염으로 진행되면 청각 기능이 떨어져 난청염이 발생합니다.',
  cause:
    '유전적으로 난청이 있는 경우가 있고, 스트레스, 염증, 노화, 화학물질 섭취 등으로 발생하게 됩니다.',
  symptoms: [
    { symptom: '머리를 지속적으로 갸우뚱거림' },
    { symptom: '이름을 불러도 반응이 없음' },
    { symptom: '귀를 들면 냄새가 남' },
    { symptom: '과도하게 자주 귀를 긁는 행동' },
  ],
  prevention:
    '고양이에게 난청을 일으키는 약물을 먹는 일이 없도록 주의해 주셔야 하며, 외이염, 중이염 등의 귀 염증 질환을 잘 관리해주셔야 합니다.',
  petType: '고양이',
  vulnerableBreed: '특별히 취약한 묘종이 존재하지 않습니다.',
  treatment: '특별한 치료법은 없습니다.',
  riskLevel: '낮음',
  managementNecessity: '낮음',
  recommendedNutrients:
    '등록하신 현재 사료에서 알레르기 가능성이 높은 원료들을 제외하고, 다른 원료로 만든 사료와 피부/모질에 좋은 오메가3 등이 함유된 영양제를 추천해 드립니다.',
};

export class DiseaseDto {
  @IsNumber()
  @ApiProperty({
    description: 'id',
    example: diseaseDtoExample.id,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'diagnosisName',
    example: diseaseDtoExample.diagnosisName,
  })
  diagnosisName: string;

  @IsString()
  @ApiProperty({
    description: 'symptoms',
    example: diseaseDtoExample.symptoms,
  })
  symptoms: SymptomDto[];

  @IsString()
  @ApiProperty({
    description: 'summary',
    example: diseaseDtoExample.summary,
  })
  summary: string;

  @IsString()
  @ApiProperty({
    description: 'cause',
    example: diseaseDtoExample.cause,
  })
  cause: string;

  @IsString()
  @ApiProperty({
    description: 'prevention',
    example: diseaseDtoExample.prevention,
  })
  prevention: string;

  @IsString()
  @ApiProperty({
    description: 'petType',
    example: diseaseDtoExample.petType,
  })
  petType: string;

  @IsString()
  @ApiProperty({
    description: 'vulnerableBreed',
    example: diseaseDtoExample.vulnerableBreed,
  })
  vulnerableBreed: string;

  @IsString()
  @ApiProperty({
    description: 'treatment',
    example: diseaseDtoExample.treatment,
  })
  treatment: string;

  @IsString()
  @ApiProperty({
    description: 'riskLevel',
    example: diseaseDtoExample.riskLevel,
  })
  riskLevel: string;

  @IsString()
  @ApiProperty({
    description: 'managementNecessity',
    example: diseaseDtoExample.managementNecessity,
  })
  managementNecessity: string;

  @IsString()
  @ApiProperty({
    description: 'recommendedNutrients',
    example: diseaseDtoExample.recommendedNutrients,
  })
  recommendedNutrients: string;
}

export class DiseaseDtoWithoutId extends OmitType(DiseaseDto, [
  'id',
] as const) {}

export class DiseaseDtoOnlyId extends PickType(DiseaseDto, ['id'] as const) {}
