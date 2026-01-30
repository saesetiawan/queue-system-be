import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../../company/entities/company.entity';
import { QueueService } from '../../service/entities/queue_service.entity';

@Entity('queue_process')
export class QueueProcess {
  @PrimaryColumn({ type: 'char', length: 40 })
  id: string;

  @ManyToOne(() => Company, (company) => company.queueProcesses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  company: Company;

  @ManyToOne(() => QueueService, (service) => service.queueProcesses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: QueueService;

  @Column()
  number: number;

  @Column({
    type: 'enum',
    enum: ['waiting', 'called', 'done', 'skipped'],
    default: 'waiting',
  })
  status: 'waiting' | 'called' | 'done' | 'skipped';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
