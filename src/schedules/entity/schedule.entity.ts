import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Schedule extends Model<Schedule> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  place: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  lat: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  lng: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  alarm: string;

  @Column({
    type: DataType.STRING,
  })
  memo: string;

  @Column({
    type: DataType.STRING,
  })
  timeZone: string;
}
