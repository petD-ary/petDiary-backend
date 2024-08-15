import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Food extends Model<Food> {
  @Column({
    type: DataType.STRING,
  })
  type: string;

  @Column({
    type: DataType.JSONB,
  })
  summary: object;

  @Column({
    type: DataType.JSONB,
  })
  title: object;

  @Column({
    type: DataType.STRING,
  })
  petType: string;

  @Column({
    type: DataType.JSONB,
  })
  tag: object;
}
