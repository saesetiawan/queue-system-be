import { UserService } from '../../auth/services/user.service';
import { EntityManager, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from '../dto/create_company.dto';

@Injectable()
export class CompanyService {
  logger = new Logger('CompanyService');
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(
    payload: CreateCompanyDto,
    entityManager?: EntityManager,
  ): Promise<Company> {
    const repo = entityManager
      ? entityManager.getRepository(Company)
      : this.companyRepository;
    const company = await repo.findOne({
      select: { id: true },
      where: { email: payload.email },
    });
    if (company) {
      throw new BadRequestException('Company already exists');
    }
    const countCompany = await repo.count();
    const data = {
      id: 'COM' + (countCompany + 1).toString().padStart(5, '0'),
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile,
      address: payload.address,
      category: payload.category,
    };
    this.logger.log(`Creating company with data: ${JSON.stringify(data)}`);
    return await repo.save(data);
  }
}
