import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { WorkerConstants } from './constants/worker.constant';
import { EmailService } from '../brevo/brevo.service';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@Processor(WorkerConstants.NAME)
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(private emailService: EmailService) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Process(WorkerConstants.JOB_EMAIL_COMPANY)
  async handleJobEmailCompany(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    await this.emailService.sendCompanyRegisterEmail(job.data);
    this.logger.debug('Transcoding completed');
  }
}
