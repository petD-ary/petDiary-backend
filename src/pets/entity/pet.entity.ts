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
export class Pet extends Model<Pet> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  petType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  breed: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  neutered: boolean;

  @Column({
    type: DataType.STRING,
  })
  birthday: string;

  @Column({
    type: DataType.STRING,
  })
  adoptionDate: string;

  @Column({
    type: DataType.STRING,
  })
  weight: string;

  @Column({
    type: DataType.STRING,
  })
  imageUrl: string;
}
