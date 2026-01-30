import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, TypeORMError } from 'typeorm';
import { BlogTag } from '../entities/blog_tag.entity';
import { CreateTagDto, UpdateTagDto } from '../dtos/tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(BlogTag)
    private readonly blogTagRepository: Repository<BlogTag>,
  ) {}

  async create(payload: CreateTagDto): Promise<BlogTag> {
    try {
      return await this.blogTagRepository.save({
        name: payload.name,
        slug: payload.slug,
      });
    } catch (error: unknown) {
      if (error instanceof TypeORMError) {
        if (error.message.includes('ER_DUP_ENTRY')) {
          throw new BadRequestException('Tag already exists!');
        }
      }
      throw error;
    }
  }

  async update(payload: UpdateTagDto): Promise<BlogTag> {
    try {
      const tag = await this.blogTagRepository.findOne({
        where: { id: payload.id },
      });
      if (!tag) {
        throw new NotFoundException('Tag not found!');
      }
      tag.name = payload.name;
      tag.slug = payload.slug;
      return await this.blogTagRepository.save(tag);
    } catch (error: unknown) {
      if (error instanceof TypeORMError) {
        if (error.message.includes('ER_DUP_ENTRY')) {
          throw new BadRequestException('Tag already exists!');
        }
      }
      throw error;
    }
  }

  async getOne(id: number): Promise<BlogTag> {
    const tag = await this.blogTagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found!');
    }

    return tag;
  }

  async getPagination(
    page = 1,
    perPage = 10,
    column?: string,
    search?: string,
  ): Promise<{
    data: BlogTag[];
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

    const [data, total] = await this.blogTagRepository.findAndCount({
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

  async deleteOne(id: number): Promise<BlogTag> {
    const tag = await this.blogTagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found!');
    }

    await this.blogTagRepository.delete({ id });
    return tag;
  }
}
