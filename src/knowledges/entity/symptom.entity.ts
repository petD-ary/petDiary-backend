import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  DefaultScope,
} from 'sequelize-typescript';

import { Disease } from './disease.entity';
import { DiseaseSymptomMap } from './diseaseSymptomMap.entity';

@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Table
export class Symptom extends Model<Symptom> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  symptom: string;

  @BelongsToMany(() => Disease, () => DiseaseSymptomMap)
  disease: Disease[];
}
