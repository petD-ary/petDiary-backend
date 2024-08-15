import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/uploads/uploads.module';
import { DiseasesController } from './diseases.controller';
import { DiseasesService } from './diseases.service';
import { SignalsController } from './signals.controller';
import { SignalsService } from './signals.service';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [DiseasesController, SignalsController, FoodsController],
  providers: [DiseasesService, SignalsService, FoodsService],
})
export class KnowledgesModule {}
