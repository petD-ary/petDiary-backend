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
import { Schedule } from './schedule.entity';

@Table
@Scopes(() => ({
  findAll: {
    include: [Schedule],
  },
  find: {
    include: [Schedule],
  },
}))
export class ScheduleInstance extends Model<ScheduleInstance> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Schedule)
  @Column
  scheduleId: number;

  @BelongsTo(() => Schedule)
  scheduleInfo: Schedule;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  repeatIndex: number;

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
}
