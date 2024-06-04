import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/uploads/uploads.module';
import { DiseasesController } from './diseases.controller';
import { DiseasesService } from './diseases.service';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [DiseasesController],
  providers: [DiseasesService],
})
export class KnowledgesModule {}
