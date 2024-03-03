import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/entity/user.entity';

@Table
export class Calendar extends Model<Calendar> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

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
    type: DataType.STRING,
    allowNull: false,
  })
  lat: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lng: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  alarm: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  repeat: string;

  @Column({
    type: DataType.STRING,
  })
  startTime: string;

  @Column({
    type: DataType.STRING,
  })
  finishTime: string;

  @Column({
    type: DataType.STRING,
  })
  memo: string;
}
