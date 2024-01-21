import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { UploadModule } from './uploads/uploads.module';

@Module({
  imports: [DatabaseModule, UsersModule, PetsModule, AuthModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
