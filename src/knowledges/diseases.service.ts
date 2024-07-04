import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DestroyOptions,
  FindOptions,
  Op,
  Optional,
  UpdateOptions,
} from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

import { DiseaseDto, DiseaseDtoWithoutId } from './dto/disease.dto';
import { Disease } from './entity/disease.entity';
import { SymptomDtoWithoutId } from './dto/symptom.dto';
import { Symptom } from './entity/symptom.entity';
import { DiseaseSymptomMap } from './entity/diseaseSymptomMap.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DiseasesService {
  async create(value: DiseaseDtoWithoutId) {
    const { symptoms, ...diseaseDetail } = value;
    const diseaseId = (await this.createDisease(diseaseDetail)).id;
    await this.createSymptoms(symptoms, diseaseId);
    return;
  }

  async createAll(values: DiseaseDtoWithoutId[]) {
    for (const value of values) {
      await this.create(value);
    }
    return;
  }

  async createDisease(
    disease: Optional<Disease, NullishPropertiesOf<Disease>>,
  ) {
    return await Disease.create(disease);
  }

  /**
   * `Symptom` 생성 후 `Disease` 와 mapping
   *
   * 기존에 이미 저장된 `Symptom` 이라면 mapping 만 시켜준다.
   * @param symptoms
   * @param diseaseId
   */
  async createSymptoms(symptoms: SymptomDtoWithoutId[], diseaseId: number) {
    for (const symptomDetail of symptoms) {
      let symptom = await Symptom.findOne({
        where: { symptom: symptomDetail.symptom },
      });

      if (!symptom) {
        symptom = await Symptom.create({ symptom: symptomDetail.symptom });
      }

      // `Disease`와 `Symptom` 연결
      await DiseaseSymptomMap.create({
        diseaseId: diseaseId,
        symptomId: symptom.id,
      });
    }
  }

  async getByAll(options?: FindOptions) {
    return Disease.scope('findAll').findAll(options);
  }

  async countByAll(options?: FindOptions) {
    return Disease.count(options);
  }

  async getBy(options: FindOptions) {
    return Disease.scope('findOne').findOne(options);
  }

  async getSymptom(options: FindOptions) {
    return Symptom.findAll(options);
  }

  async update(diseaseDto: DiseaseDto, options: UpdateOptions) {
    const { symptoms, ...diseaseDetail } = diseaseDto;
    return Disease.update(diseaseDetail, options);
  }

  /**
   * `Disease` update
   *
   * 새로 추가된 Symptoms 저장 및 매핑, 없어진 Symptoms 매핑 제거
   * @param symptoms
   * @param diseaseId
   */
  async updateDiseaseWithSymptoms(
    diseaseId: number,
    value: DiseaseDtoWithoutId,
  ) {
    const { symptoms, ...diseaseDetail } = value;

    // Disease 정보 업데이트
    const updateResult = await Disease.update(diseaseDetail, {
      where: { id: diseaseId },
    });
    // Disease 정보 업데이트 실패 시 Not found
    if (updateResult[0] === 0) {
      return new NotFoundException('Update failed');
    }

    // 기존 Symptoms 가져오기
    const currentSymptoms = await Symptom.findAll({
      include: [
        {
          model: Disease,
          where: { id: diseaseId },
          through: {
            attributes: [],
          },
        },
      ],
    });

    // 새로 추가된 Symptoms 저장 및 매핑
    const currentSymptomSet = new Set(currentSymptoms.map((s) => s.symptom));
    const newSymptoms = symptoms.filter(
      (symptom) => !currentSymptomSet.has(symptom.symptom),
    );
    await this.createSymptoms(newSymptoms, diseaseId);

    // 없어진 Symptoms 매핑 제거
    const newSymptomSet = new Set(symptoms.map((s) => s.symptom));
    for (const currentSymptom of currentSymptoms) {
      if (!newSymptomSet.has(currentSymptom.symptom)) {
        // 매핑 제거
        await DiseaseSymptomMap.destroy({
          where: {
            diseaseId: diseaseId,
            symptomId: currentSymptom.id,
          },
        });

        // Orphan Removal
        this.orphanRemovalSymptom(currentSymptom.id);
      }
    }
  }

  async delete(options: DestroyOptions) {
    const disease = await this.getBy(options);

    // Disease 가 없다면 Not found
    if (disease === null) {
      return new NotFoundException('Update failed');
    }

    await Disease.destroy(options);

    for (const symptom of disease.symptoms) {
      await this.orphanRemovalSymptom(symptom.id);
    }
  }

  /**
   * Orphan Removal
   */
  async orphanRemovalSymptom(symptomId: number) {
    const remainingMappings = await DiseaseSymptomMap.count({
      where: {
        symptomId: symptomId,
      },
    });
    if (remainingMappings === 0) {
      await Symptom.destroy({
        where: {
          id: symptomId,
        },
      });
    }
  }

  /**
   * 주어진 `sortField`와 `sortOrder` 문자열을 사용하여 Sequelize 쿼리 정렬 순서를 생성
   * `riskLevel` 필드에 대해 `높음`, `보통`, `낮음` 순서로 정렬
   *
   * @param sort - `'sortField,sortOrder'` 형식의 문자열. 예: `'riskLevel,high'`
   * @returns - 정렬 순서를 나타내는 Sequelize 쿼리 옵션 배열
   */
  createSortOrder(sort: string): string[] {
    let order = [];
    const [sortField, sortOrder] = sort?.split(',') || [];
    if (sortField === 'riskLevel' && sortOrder === 'high') {
      order = [
        [
          Sequelize.literal(`CASE
                WHEN "Disease"."riskLevel" = '높음' THEN 1
                WHEN "Disease"."riskLevel" = '보통' THEN 2
                WHEN "Disease"."riskLevel" = '낮음' THEN 3
                ELSE 4
              END`),
        ],
      ];
    } else if (sortField === 'riskLevel' && sortOrder === 'low') {
      order = [
        [
          Sequelize.literal(`CASE
                WHEN "Disease"."riskLevel" = '높음' THEN 4
                WHEN "Disease"."riskLevel" = '보통' THEN 3
                WHEN "Disease"."riskLevel" = '낮음' THEN 2
                ELSE 1
              END`),
        ],
      ];
    }
    return order;
  }

  /**
   * 주어진 매개변수를 기반으로 Sequelize FindOptions 객체를 생성
   *
   * @param petType - 결과를 필터링할 애완동물 종류
   * @param cursor - 페이지네이션을 위한 커서 값
   * @param sort - 정렬 기준 필드와 정렬 순서. 예: `'riskLevel,high'`
   * @param size - 페이지당 반환되는 결과 수
   * @returns - Sequelize FindOptions 객체
   */
  createOptions(
    petType?: string,
    cursor?: string,
    sort?: string,
    size?: number,
  ): FindOptions {
    let cursorExpression = '';
    const [sortField, sortOrder] = sort?.split(',') || [];
    if (sortField === 'riskLevel' && sortOrder === 'high') {
      const riskLevel = '"Disease"."riskLevel"';
      cursorExpression = `CAST(CONCAT(LPAD(${riskLevel}, 1, \'0\'), LPAD(CAST(POWER(10, 4) - CAST("Disease"."id" AS NUMERIC) AS TEXT), 4, \'0\')) AS NUMERIC)`;
    } else if (sortField === 'riskLevel' && sortOrder === 'low') {
      const riskLevel =
        'CAST(10 - CAST("Disease"."riskLevel" AS NUMERIC) AS TEXT)';
      cursorExpression = `CAST(CONCAT(LPAD(${riskLevel}, 1, \'0\'), LPAD(CAST(POWER(10, 4) - CAST("Disease"."id" AS NUMERIC) AS TEXT), 4, \'0\')) AS NUMERIC)`;
    }

    const options: FindOptions = {
      where: {
        ...(petType && { petType }),
        ...(cursor && {
          [Op.and]: Sequelize.literal(`${cursorExpression} < ${cursor}`),
        }),
      },
      order: [
        [Sequelize.literal(cursorExpression), 'DESC'],
        ['id', 'DESC'],
      ],
      attributes: {
        include: [[Sequelize.literal(cursorExpression), 'cursor']],
      },
      limit: Number(size) + 1,
    };

    return options;
  }

  /**
   * 주어진 매개변수를 기반으로 Sequelize FindOptions 객체를 생성
   *
   * @param search - 검색어
   */
  createSymptomOptions(search?: string): FindOptions {
    const options = {
      where: {
        symptom: { [Op.like]: `%${search}%` },
      },
    };

    return options;
  }
}
