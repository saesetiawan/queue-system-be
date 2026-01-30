import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateQueueServiceDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
