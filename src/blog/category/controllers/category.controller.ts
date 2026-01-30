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
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { BlogCategory } from '../entites/blog_category.entity';
import { CategoryService } from '../services/category.service';
import { JwtAuthGuard } from '../../../auth/guard/jwt.guard';

@Controller('/api/blog/category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() payload: CreateCategoryDto): Promise<{
    data: BlogCategory;
    message: string;
  }> {
    return {
      data: await this.categoryService.create(payload),
      message: 'Category created is successfully',
    };
  }

  @Put()
  async update(@Body() payload: UpdateCategoryDto): Promise<{
    data: BlogCategory;
    message: string;
  }> {
    return {
      data: await this.categoryService.update(payload),
      message: 'Category updated is successfully',
    };
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<{
    data: BlogCategory;
    message: string;
  }> {
    return {
      data: await this.categoryService.getOne(id),
      message: 'Get category is successfully',
    };
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: number): Promise<{
    data: BlogCategory;
    message: string;
  }> {
    return {
      data: await this.categoryService.deleteOne(+id),
      message: 'Delete category is successfully',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPagination(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('column') column?: string,
    @Query('search') search?: string,
  ): Promise<{
    data: BlogCategory[];
    total: number;
    page: number;
    perPage: number;
    message: string;
  }> {
    const result = await this.categoryService.getPagination(
      Number(page),
      Number(perPage),
      column,
      search,
    );
    return {
      ...result,
      message: 'Get categories is successfully',
    };
  }
}
