import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsString()
  description: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
