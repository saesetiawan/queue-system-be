import { Injectable } from '@nestjs/common';
import { CreateQueueServiceUseCase } from '../usecases/create_queue_service.usecase';
import { UpdateQueueServiceUseCase } from '../usecases/update_queue_service.usecase';
import { GetQueueServiceUseCase } from '../usecases/get_queue_service.usecase';
import { UpdateQueueServiceDto } from '../dtos/update_queue_service.dto';
import { CreateQueueServiceDto } from '../dtos/create_queue_service.dto';
import { DeleteQueueServiceUseCase } from '../usecases/delete_queue_service.usecase';

@Injectable()
export class QueueServicesService {
  constructor(
    private readonly createUseCase: CreateQueueServiceUseCase,
    private readonly updateUseCase: UpdateQueueServiceUseCase,
    private readonly deleteUseCase: DeleteQueueServiceUseCase,
    private readonly getUseCase: GetQueueServiceUseCase,
  ) {}

  create(id: string, dto: CreateQueueServiceDto) {
    return this.createUseCase.execute(id, dto);
  }

  update(id: string, dto: UpdateQueueServiceDto) {
    return this.updateUseCase.execute(id, dto);
  }

  findAll(tenantId: string, page = 1, perPage = 10, search?: string) {
    return this.getUseCase.findAll(tenantId, page, perPage, search);
  }

  findOne(id: string) {
    return this.getUseCase.findById(id);
  }

  delete(id: string) {
    return this.deleteUseCase.execute(id);
  }
}
