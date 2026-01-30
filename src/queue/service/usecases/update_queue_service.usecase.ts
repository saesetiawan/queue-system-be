import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueService } from '../entities/queue_service.entity';
import { UpdateQueueServiceDto } from '../dtos/update_queue_service.dto';

@Injectable()
export class UpdateQueueServiceUseCase {
  constructor(
    @InjectRepository(QueueService)
    private readonly queueRepo: Repository<QueueService>,
  ) {}

  async execute(
    tenantId: string,
    dto: UpdateQueueServiceDto,
  ): Promise<QueueService> {
    const service = await this.queueRepo.findOne({
      where: { id: dto.id, tenant_id: tenantId },
    });
    if (!service) throw new Error('Service not found');

    if (dto.name) service.name = dto.name;
    if (dto.description) service.description = dto.description;

    return await this.queueRepo.save(service);
  }
}
