import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entity/user.entity';
import { Pet } from 'src/pets/entity/pet.entity';
import { Schedule } from 'src/schedules/entity/schedule.entity';
import { ScheduleInstance } from 'src/schedules/entity/scheduleInstance.entity';
import { Disease } from 'src/knowledges/entity/disease.entity';
import { Symptom } from 'src/knowledges/entity/symptom.entity';
import { DiseaseSymptomMap } from 'src/knowledges/entity/diseaseSymptomMap.entity';
import { Signal } from 'src/knowledges/entity/signal.entity';
import { Food } from 'src/knowledges/entity/food.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (): Promise<Sequelize> => {
      const sequelize = new Sequelize(
        process.env.POSTGRES_DB,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD,
        {
          dialect: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
        },
      );
      sequelize.addModels([
        User,
        Pet,
        Schedule,
        ScheduleInstance,
        Disease,
        Symptom,
        DiseaseSymptomMap,
        Signal,
        Food,
      ]);
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
