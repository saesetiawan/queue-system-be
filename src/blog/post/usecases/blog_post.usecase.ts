import { Injectable } from '@nestjs/common';
import { BlogPost } from '../entities/blog_post.entity';
import { BlogPostService } from '../services/blog_post.service';
import { CreatePostDto, UpdatePostDto } from '../dtos/blog_post.dto';
import { JwtPayload } from '../../../auth/dtos/jwt.dto';

@Injectable()
export class BlogPostUseCase {
  constructor(private readonly postService: BlogPostService) {}

  async createPost(
    payload: CreatePostDto,
    currentUser: JwtPayload,
  ): Promise<{ data: BlogPost; message: string }> {
    const data = await this.postService.create(payload, currentUser);
    return { data, message: 'Post created successfully' };
  }

  async updatePost(
    payload: UpdatePostDto,
  ): Promise<{ data: BlogPost; message: string }> {
    const data = await this.postService.update(payload);
    return { data, message: 'Post updated successfully' };
  }

  async getPostById(id: number): Promise<{ data: BlogPost; message: string }> {
    const data = await this.postService.getOne(id);
    return { data, message: 'Get post successfully' };
  }

  async getPostList(
    page = 1,
    perPage = 10,
    search?: string,
    column?: string,
  ): Promise<{
    data: BlogPost[];
    total: number;
    page: number;
    perPage: number;
    message: string;
  }> {
    const result = await this.postService.getPagination(
      page,
      perPage,
      column,
      search,
    );
    return { ...result, message: 'Get posts successfully' };
  }

  async deletePost(id: number): Promise<{ data: BlogPost; message: string }> {
    const data = await this.postService.deleteOne(id);
    return { data, message: 'Post deleted successfully' };
  }
}
