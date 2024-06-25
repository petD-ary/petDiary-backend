import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/uploads/uploads.module';
import { DiseasesController } from './diseases.controller';
import { DiseasesService } from './diseases.service';
import { SignalsController } from './signals.controller';
import { SignalsService } from './signals.service';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [DiseasesController, SignalsController],
  providers: [DiseasesService, SignalsService],
})
export class KnowledgesModule {}
