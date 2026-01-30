import { Injectable, BadRequestException } from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { BlogTag } from '../entities/blog_tag.entity';
import { CreateTagDto, UpdateTagDto } from '../dtos/tag.dto';

@Injectable()
export class TagUseCase {
  constructor(private readonly tagService: TagService) {}

  async createTag(payload: CreateTagDto): Promise<{
    data: BlogTag;
    message: string;
  }> {
    if (!payload.name || !payload.slug) {
      throw new BadRequestException('Name and slug are required');
    }

    const tag = await this.tagService.create(payload);

    return {
      data: tag,
      message: 'Tag created successfully',
    };
  }

  async updateTag(payload: UpdateTagDto): Promise<{
    data: BlogTag;
    message: string;
  }> {
    if (!payload.id) {
      throw new BadRequestException('Tag ID is required');
    }

    const tag = await this.tagService.update(payload);

    return {
      data: tag,
      message: 'Tag updated successfully',
    };
  }

  async getTagById(id: number): Promise<{
    data: BlogTag;
    message: string;
  }> {
    const tag = await this.tagService.getOne(id);

    return {
      data: tag,
      message: 'Get tag successfully',
    };
  }

  async getTagList(
    page = 1,
    perPage = 10,
    column?: string,
    search?: string,
  ): Promise<{
    data: BlogTag[];
    total: number;
    page: number;
    perPage: number;
    message: string;
  }> {
    const result = await this.tagService.getPagination(
      page,
      perPage,
      column,
      search,
    );

    return {
      ...result,
      message: 'Get tags successfully',
    };
  }

  async deleteTag(id: number): Promise<{
    data: BlogTag;
    message: string;
  }> {
    const tag = await this.tagService.deleteOne(id);

    return {
      data: tag,
      message: 'Tag deleted successfully',
    };
  }
}
