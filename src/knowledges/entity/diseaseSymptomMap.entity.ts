import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Disease } from './disease.entity';
import { Symptom } from './symptom.entity';

@Table
export class DiseaseSymptomMap extends Model<DiseaseSymptomMap> {
  @PrimaryKey
  @ForeignKey(() => Disease)
  @Column
  diseaseId: number;

  @BelongsTo(() => Disease, { onDelete: 'CASCADE' })
  disease: Disease;

  @PrimaryKey
  @ForeignKey(() => Symptom)
  @Column
  symptomId: number;

  @BelongsTo(() => Symptom, { onDelete: 'CASCADE' })
  symptom: Symptom;
}
