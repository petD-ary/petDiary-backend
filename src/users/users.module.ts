import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PetsModule } from 'src/pets/pets.module';
import { SchedulesModule } from 'src/schedules/schedules.module';

@Global()
@Module({
  imports: [forwardRef(() => AuthModule), PetsModule, SchedulesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
