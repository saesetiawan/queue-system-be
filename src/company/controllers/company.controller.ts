import { Body, Controller, Post } from '@nestjs/common';
import { CompanyRegisterUserCase } from '../usecases/company_register.usercase';
import { CreateCompanyDto } from '../dto/create_company.dto';

@Controller('/api/company')
export class CompanyController {
  constructor(private companyRegisterUserCase: CompanyRegisterUserCase) {}

  @Post('/register')
  register(@Body() payload: CreateCompanyDto) {
    return this.companyRegisterUserCase.register(payload);
  }
}
