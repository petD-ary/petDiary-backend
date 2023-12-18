import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports: [AuthModule],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
