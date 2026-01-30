import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueService } from '../entities/queue_service.entity';
import { Company } from '../../../company/entities/company.entity';
import { v7 as uuid } from 'uuid';
import { CreateQueueServiceDto } from '../dtos/create_queue_service.dto';

@Injectable()
export class CreateQueueServiceUseCase {
  constructor(
    @InjectRepository(QueueService)
    private readonly queueRepo: Repository<QueueService>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async execute(
    tenantId: string,
    dto: CreateQueueServiceDto,
  ): Promise<QueueService> {
    const company = await this.companyRepo.findOne({
      where: { id: tenantId },
    });

    if (!company) throw new Error('Company not found');

    const queueService = this.queueRepo.create({
      id: uuid(),
      company,
      name: dto.name,
      description: dto.description,
    });

    return await this.queueRepo.save(queueService);
  }
}
