import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserCompany } from '../../auth/entitites/user_company.entity';
import { QueueService } from '../../queue/service/entities/queue_service.entity';
import { QueueProcess } from '../../queue/process/entities/queue_process.entity';

@Entity('companies')
export class Company {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  mobile: string;

  @OneToMany(() => UserCompany, (uc) => uc.company)
  userCompanies: UserCompany[];

  @OneToMany(() => QueueService, (service) => service.company)
  queueServices: QueueService[];

  @OneToMany(() => QueueProcess, (process) => process.company)
  queueProcesses: QueueProcess[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
