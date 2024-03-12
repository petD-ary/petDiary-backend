import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Repeat extends Model<Repeat> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  repeat: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  repeatCount: number;
}
