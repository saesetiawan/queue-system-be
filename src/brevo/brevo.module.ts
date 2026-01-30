import { Global, Module } from '@nestjs/common';
import { EmailService } from './brevo.service';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '../common/common.module';

@Global()
@Module({
  imports: [HttpModule, CommonModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
