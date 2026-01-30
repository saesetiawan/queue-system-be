import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQueueServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
