import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { QueueNumberGateway } from './gateway/queue-number.gateway';
import { QueueProcessController } from './controllers/queue_process.controller';
import { QueueProcessNumberService } from './services/queue_process_number.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueProcess } from './entities/queue_process.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([QueueProcess])],
  controllers: [QueueProcessController],
  providers: [QueueNumberGateway, QueueProcessNumberService],
  exports: [],
})
export class QueueProcessModule {}
