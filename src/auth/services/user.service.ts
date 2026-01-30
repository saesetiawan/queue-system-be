import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entitites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create_user.dto';
import { Company } from '../../company/entities/company.entity';
import { UserCompany } from '../entitites/user_company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
  ) {}
  async create(
    payload: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    const repo = entityManager
      ? entityManager.getRepository(User)
      : this.usersRepository;
    const userExists = await this.findByEmail(payload.email, entityManager);
    if (userExists) {
      throw new BadRequestException('Email already exists!');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    const user = await repo.save({
      password: hashedPassword,
      email: payload.email,
      is_active: payload.is_active,
    });
    if (!user) {
      throw new InternalServerErrorException('User is failed created');
    }
    return user;
  }

  async findByEmail(
    email: string,
    entityManager?: EntityManager,
  ): Promise<User | null> {
    const repo = entityManager
      ? entityManager.getRepository(User)
      : this.usersRepository;
    return await repo.findOne({
      where: { email },
      relations: ['userCompanies', 'userCompanies.company'],
    });
  }

  async createUserCompany(
    company: Company,
    user: User,
    role: 'company' | 'admin' | 'operator',
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(UserCompany)
      : this.userCompanyRepository;
    await repo.save({
      company,
      user,
      role,
    });
  }

  async setNewPassword(
    email: string,
    newPassword: string,
    isActive = true,
  ): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const salt = await bcrypt.genSalt(10);
    user.is_active = isActive;
    user.password = await bcrypt.hash(newPassword, salt);
    await this.usersRepository.save(user);
    return user;
  }
}
