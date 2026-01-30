import { Module } from '@nestjs/common';
import { GenerateRandomStringService } from './services/generate_random_string.service';
import { EncryptionService } from './services/encryption.service';

@Module({
  providers: [GenerateRandomStringService, EncryptionService],
  exports: [GenerateRandomStringService, EncryptionService],
})
export class CommonModule {}
