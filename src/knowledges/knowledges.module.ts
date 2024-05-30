import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/uploads/uploads.module';
import { KnowledgesController } from './knowledges.controller';
import { KnowledgesService } from './knowledges.service';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [KnowledgesController],
  providers: [KnowledgesService],
})
export class KnowledgesModule {}
