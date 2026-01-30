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
import { JwtAuthGuard } from '../../../auth/guard/jwt.guard';
import { BlogPostUseCase } from '../usecases/blog_post.usecase';
import { CreatePostDto, UpdatePostDto } from '../dtos/blog_post.dto';
import { UserDecorator } from '../../../auth/decorators/user.decorator';
import type { JwtPayload } from '../../../auth/dtos/jwt.dto';

@Controller('/api/blog/post')
@UseGuards(JwtAuthGuard)
export class BlogPostController {
  constructor(private readonly postUseCase: BlogPostUseCase) {}

  @Post()
  async create(
    @Body() payload: CreatePostDto,
    @UserDecorator() user: JwtPayload,
  ) {
    return this.postUseCase.createPost(payload, user);
  }

  @Put()
  async update(@Body() payload: UpdatePostDto) {
    return this.postUseCase.updatePost(payload);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return this.postUseCase.getPostById(Number(id));
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.postUseCase.deletePost(Number(id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPagination(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('search') search?: string,
    @Query('column') column?: string,
  ) {
    return this.postUseCase.getPostList(
      Number(page),
      Number(perPage),
      search,
      column,
    );
  }
}
