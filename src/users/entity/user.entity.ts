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
  status: string;

  @HasMany(() => Pet)
  pets: Pet[];
}
