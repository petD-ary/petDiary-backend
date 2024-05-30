import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  Scopes,
} from 'sequelize-typescript';
import { DiseaseSymptomMap } from './diseaseSymptomMap.entity';
import { Symptom } from './symptom.entity';

@Scopes(() => ({
  findAll: {
    include: [
      {
        model: Symptom,
        through: { attributes: [] },
      },
    ],
  },
  findOne: {
    include: [
      {
        model: Symptom,
        through: { attributes: [] },
      },
    ],
  },
}))
@Table
export class Disease extends Model<Disease> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  diagnosisName: string;

  @BelongsToMany(() => Symptom, () => DiseaseSymptomMap)
  symptoms: Symptom[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  summary: string;

  @Column({
    type: DataType.STRING,
  })
  cause: string;

  @Column({
    type: DataType.STRING,
  })
  prevention: string;

  @Column({
    type: DataType.STRING,
  })
  petType: string;

  @Column({
    type: DataType.STRING,
  })
  vulnerableBreed: string;

  @Column({
    type: DataType.STRING,
  })
  treatment: string;

  @Column({
    type: DataType.STRING,
  })
  riskLevel: string;

  @Column({
    type: DataType.STRING,
  })
  managementNecessity: string;

  @Column({
    type: DataType.STRING,
  })
  recommendedNutrients: string;
}
