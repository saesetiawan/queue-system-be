import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, TypeORMError } from 'typeorm';
import { BlogCategory } from '../entites/blog_category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private blogCategoryRepository: Repository<BlogCategory>,
  ) {}
  async create(payload: CreateCategoryDto): Promise<BlogCategory> {
    try {
      return await this.blogCategoryRepository.save({
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
      });
    } catch (error: unknown) {
      if (error instanceof TypeORMError) {
        if (error.message.split(':')[0] === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Category already exists!');
        }
      }
      throw error;
    }
  }

  async update(payload: UpdateCategoryDto): Promise<BlogCategory> {
    try {
      const category = await this.blogCategoryRepository.findOne({
        where: {
          id: payload.id,
        },
      });
      if (!category) {
        throw new NotFoundException('Category not found!');
      }
      category.name = payload.name;
      category.slug = payload.slug;
      category.description = payload.description;
      return await this.blogCategoryRepository.save(category);
    } catch (error: unknown) {
      if (error instanceof TypeORMError) {
        if (error.message.split(':')[0] === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Category already exists!');
        }
      }
      throw error;
    }
  }

  async getOne(id: number): Promise<BlogCategory> {
    const category = await this.blogCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return category;
  }

  async getPagination(
    page = 1,
    perPage = 10,
    column?: string,
    search?: string,
  ): Promise<{
    data: BlogCategory[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const skip = (page - 1) * perPage;
    let where = {};
    if (column && search) {
      where = search
        ? [{ name: Like(`%${search}%`) }, { slug: Like(`%${search}%`) }]
        : {};
    }

    const [data, total] = await this.blogCategoryRepository.findAndCount({
      where,
      take: perPage,
      skip,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      perPage,
    };
  }

  async deleteOne(id: number): Promise<BlogCategory> {
    const category = await this.blogCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    await this.blogCategoryRepository.delete({
      id: id,
    });
    return category;
  }
}
