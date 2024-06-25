import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Signal extends Model<Signal> {
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
    type: DataType.JSONB,
  })
  content: object;

  @Column({
    type: DataType.JSONB,
  })
  tag: object;
}
