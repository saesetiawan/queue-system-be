import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogTag } from '../entities/blog_tag.entity';
import { JwtAuthGuard } from '../../../auth/guard/jwt.guard';
import { CreateTagDto, UpdateTagDto } from '../dtos/tag.dto';
import { TagUseCase } from '../usecases/tag.usecase';

@Controller('/api/blog/tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagUseCase: TagUseCase) {}

  @Post()
  async create(@Body() payload: CreateTagDto): Promise<{
    data: BlogTag;
    message: string;
  }> {
    return await this.tagUseCase.createTag(payload);
  }

  @Put()
  async update(@Body() payload: UpdateTagDto): Promise<{
    data: BlogTag;
    message: string;
  }> {
    return await this.tagUseCase.updateTag(payload);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<{
    data: BlogTag;
    message: string;
  }> {
    return await this.tagUseCase.getTagById(Number(id))
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: number): Promise<{
    data: BlogTag;
    message: string;
  }> {
    return await this.tagUseCase.deleteTag(Number(id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPagination(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('column') column?: string,
    @Query('search') search?: string,
  ): Promise<{
    data: BlogTag[];
    total: number;
    page: number;
    perPage: number;
    message: string;
  }> {
    return await this.tagUseCase.getTagList(
      Number(page),
      Number(perPage),
      column,
      search,
    );
  }
}
