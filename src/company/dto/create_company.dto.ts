import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  mobile: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
