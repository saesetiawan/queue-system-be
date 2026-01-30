import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueService } from '../entities/queue_service.entity';

@Injectable()
export class DeleteQueueServiceUseCase {
  constructor(
    @InjectRepository(QueueService)
    private readonly queueRepo: Repository<QueueService>,
  ) {}

  async execute(id: string): Promise<void> {
    const service = await this.queueRepo.findOne({ where: { id } });
    if (!service) throw new Error('Service not found');
    await this.queueRepo.remove(service);
  }
}
