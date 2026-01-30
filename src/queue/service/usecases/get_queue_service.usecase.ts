import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueueService } from '../entities/queue_service.entity';
import { UserService } from '../../../auth/services/user.service';

@Injectable()
export class GetQueueServiceUseCase {
  constructor(
    @InjectRepository(QueueService)
    private readonly queueRepo: Repository<QueueService>,
    private readonly userService: UserService,
  ) {}

  async findAll(
    tenantId: string,
    page = 1,
    perPage = 10,
    search?: string,
  ): Promise<{
    data: QueueService[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const skip = (page - 1) * perPage;
    const where: FindOptionsWhere<QueueService> = {
      company: { id: tenantId },
    };
    if (search) {
      where.name = `%${search}%`;
    }
    const [data, total] = await this.queueRepo.findAndCount({
      where,
      relations: ['company'],
      take: perPage,
      skip,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, perPage };
  }

  async findById(id: string): Promise<QueueService | null> {
    return await this.queueRepo.findOne({
      where: { id },
      relations: ['company'],
    });
  }
}
