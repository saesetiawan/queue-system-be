import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { QueueServiceModule } from './service/queue_service.module';
import { QueueProcessModule } from './process/queue_process.module';

@Module({
  imports: [AuthModule, QueueServiceModule, QueueProcessModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class QueueModule {}
