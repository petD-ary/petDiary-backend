import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DestroyOptions,
  FindOptions,
  Optional,
  UpdateOptions,
} from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';

import { DiseaseDto, DiseaseDtoWithoutId } from './dto/disease.dto';
import { Disease } from './entity/disease.entity';
import { SymptomDtoWithoutId } from './dto/symptom.dto';
import { Symptom } from './entity/symptom.entity';
import { DiseaseSymptomMap } from './entity/diseaseSymptomMap.entity';

@Injectable()
export class KnowledgesService {
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

  async getByAll() {
    return Disease.scope('findAll').findAll();
  }

  async getBy(options: FindOptions) {
    return Disease.scope('findOne').findOne(options);
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
}
