import { Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create_company.dto';
import { CompanyService } from '../services/company.service';
import { GenerateRandomStringService } from '../../common/services/generate_random_string.service';
import { UserService } from '../../auth/services/user.service';
import { DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { WorkerConstants } from '../../worker/constants/worker.constant';
import { Queue } from 'bullmq';

@Injectable()
export class CompanyRegisterUserCase {
  private readonly loggerService = new Logger('CompanyRegisterUserCase');
  constructor(
    private readonly companyService: CompanyService,
    private readonly generateRandomStringService: GenerateRandomStringService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    @InjectQueue(WorkerConstants.NAME) private readonly emailQueue: Queue,
  ) {}

  async register(payload: CreateCompanyDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const company = await this.companyService.create(
        payload,
        queryRunner.manager,
      );
      const password =
        this.generateRandomStringService.generateStringPassword();
      const user = await this.userService.create(
        {
          email: payload.email,
          password,
          is_active: false,
        },
        queryRunner.manager,
      );
      await this.userService.createUserCompany(
        company,
        user,
        'company',
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      await this.emailQueue.add(WorkerConstants.JOB_EMAIL_COMPANY, {
        to: payload.email,
        companyName: payload.name,
      });
      return { message: 'Company is successfully registered', data: payload };
    } catch (err) {
      this.loggerService.error(`Error register company: ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
