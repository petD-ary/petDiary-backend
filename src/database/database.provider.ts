import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entity/user.entity';
import { Pet } from 'src/pets/entity/pet.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (): Promise<Sequelize> => {
      const sequelize = new Sequelize(
        process.env.POSTGRES_DB,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD,
        { host: 'localhost', dialect: 'postgres', port: +process.env.DB_PORT },
      );
      sequelize.addModels([User, Pet]);
      try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection has been established successfully.');
      } catch (e) {
        console.error(e);
      }
      return sequelize;
    },
  },
];
