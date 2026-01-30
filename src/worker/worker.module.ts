import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailProcessor } from './email.processor';
import { WorkerConstants } from './constants/worker.constant';
import { EmailModule } from '../brevo/brevo.module';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    BullModule.registerQueue({
      name: WorkerConstants.NAME,
    }),
    EmailModule,
  ],
  controllers: [],
  providers: [EmailProcessor, BullModule],
})
export class WorkerModule {}
