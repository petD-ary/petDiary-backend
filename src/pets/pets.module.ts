import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/uploads/uploads.module';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
