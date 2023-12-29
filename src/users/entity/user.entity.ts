import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Pet } from 'src/pets/entity/pet.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  nickname: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  provider: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: STATUS;

  @HasMany(() => Pet)
  pets: Pet[];
}

export const STATUS = {
  ACTIVE: 'active',
  TEMPORARY: 'temporary',
};
export type STATUS = (typeof STATUS)[keyof typeof STATUS];
