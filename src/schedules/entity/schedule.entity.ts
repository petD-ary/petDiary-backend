import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Scopes,
} from 'sequelize-typescript';
import { User } from 'src/users/entity/user.entity';
import { Repeat } from './repeat.entity';

@Table
@Scopes(() => ({
  findAll: {
    include: [Repeat],
  },
  find: {
    include: [Repeat],
  },
}))
export class Schedule extends Model<Schedule> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Repeat)
  @Column
  repeatId: number;

  @BelongsTo(() => Repeat)
  repeatInfo: Repeat;

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
    type: DataType.DATE,
    allowNull: false,
  })
  startTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endTime: Date;

  @Column({
    type: DataType.STRING,
  })
  memo: string;
}
