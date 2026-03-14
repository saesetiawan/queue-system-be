import { Injectable } from '@nestjs/common';
import { QueueNumberGateway } from '../gateway/queue-number.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QueueProcess } from '../entities/queue_process.entity';
import { GetNumber } from '../dtos/GetNumber';
import { v7 as uuid } from 'uuid';

@Injectable()
export class QueueProcessNumberService {
  constructor(
    private readonly queueGateway: QueueNumberGateway,
    @InjectRepository(QueueProcess)
    private readonly queueProcessRepository: Repository<QueueProcess>,
    private readonly dataSource: DataSource,
  ) {}

  updateQueue(queueId: string, data: any) {
    // update database
    this.queueGateway.sendQueueNumber(queueId, data);
  }

  async getNumberByServiceId(serviceId: string): Promise<GetNumber> {
    const processNumber = await this.queueProcessRepository.findOne({
      where: {
        service: {
          id: serviceId,
        },
      },
      order: {
        id: 'DESC',
      },
    });
    return {
      service_id: serviceId,
      number: processNumber?.number ?? 0,
    };
  }
  async takeNumberByServiceId(
    tenantId: string,
    serviceId: string,
  ): Promise<GetNumber> {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log(tenantId, serviceId)
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lastQueue = await this.queueProcessRepository.findOne({
        where: {
          service: {
            id: serviceId,
          },
        },
        transaction: true,
        lock: {
          mode: 'pessimistic_write',
        },
        order: {
          id: 'DESC',
        },
      });

      const nextNumber = (lastQueue?.number ?? 0) + 1;

      const newQueue = this.queueProcessRepository.create({
        id: uuid(),
        number: nextNumber,
        service: { id: serviceId },
        company: {
          id: tenantId,
        },
      });

      await this.queueProcessRepository.save(newQueue, {
        transaction: true,
      });

      await queryRunner.commitTransaction();

      const result: GetNumber = {
        service_id: serviceId,
        number: nextNumber,
      };
      this.queueGateway.sendQueueNumber(serviceId, result);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
