import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;
}

export class UpdateTagDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  name: string;

  @IsOptional()
  slug: string;
}
