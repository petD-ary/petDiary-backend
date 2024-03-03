import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';

@Module({
  imports: [AuthModule],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}
