import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/entity/user.entity';
import { Repeat } from './repeat.entity';

@Table
export class Schedule extends Model<Schedule> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Repeat)
  @Column
  repeatId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

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
  startTime: string;

  @Column({
    type: DataType.STRING,
  })
  endTime: string;

  @Column({
    type: DataType.STRING,
  })
  memo: string;
}
