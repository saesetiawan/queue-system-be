import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Company } from '../../../company/entities/company.entity';
import { QueueProcess } from '../../process/entities/queue_process.entity';

@Entity('queue_services')
export class QueueService {
  @PrimaryColumn({ type: 'char', length: 40 })
  id: string;

  @ManyToOne(() => Company, (company) => company.queueServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  company: Company;

  @Column()
  tenant_id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 60 })
  last_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => QueueProcess, (queue) => queue.service)
  queueProcesses: QueueProcess[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
