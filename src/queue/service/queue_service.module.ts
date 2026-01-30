import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { QueueServicesService } from './services/queue_service.service';
import { UpdateQueueServiceUseCase } from './usecases/update_queue_service.usecase';
import { GetQueueServiceUseCase } from './usecases/get_queue_service.usecase';
import { DeleteQueueServiceUseCase } from './usecases/delete_queue_service.usecase';
import { QueueServicesController } from './controllers/queue_service.controller';
import { CreateQueueServiceUseCase } from './usecases/create_queue_service.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './entities/queue_service.entity';
import { CompanyModule } from '../../company/company.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([QueueService]),
    CompanyModule,
  ],
  controllers: [QueueServicesController],
  providers: [
    QueueServicesService,
    CreateQueueServiceUseCase,
    UpdateQueueServiceUseCase,
    GetQueueServiceUseCase,
    DeleteQueueServiceUseCase,
  ],
  exports: [],
})
export class QueueServiceModule {}
