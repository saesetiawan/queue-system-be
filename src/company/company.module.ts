import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyService } from './services/company.service';
import { CommonModule } from '../common/common.module';
import { CompanyRegisterUserCase } from './usecases/company_register.usercase';
import { CompanyController } from './controllers/company.controller';
import { BullModule } from '@nestjs/bull';
import { WorkerConstants } from '../worker/constants/worker.constant';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    BullModule.registerQueue({
      name: WorkerConstants.NAME,
    }),
    TypeOrmModule.forFeature([Company]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRegisterUserCase],
  exports: [TypeOrmModule],
})
export class CompanyModule {}
