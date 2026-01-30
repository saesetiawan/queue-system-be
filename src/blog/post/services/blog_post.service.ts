import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { BlogPost } from '../entities/blog_post.entity';
import { BlogCategory } from '../../category/entites/blog_category.entity';
import { BlogTag } from '../../tag/entities/blog_tag.entity';
import { User } from '../../../auth/entitites/user.entity';
import { CreatePostDto, UpdatePostDto } from '../dtos/blog_post.dto';
import { JwtPayload } from '../../../auth/dtos/jwt.dto';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly postRepository: Repository<BlogPost>,
    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>,
    @InjectRepository(BlogTag)
    private readonly tagRepository: Repository<BlogTag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    payload: CreatePostDto,
    currentUser: JwtPayload,
  ): Promise<BlogPost> {
    const author = await this.userRepository.findOne({
      where: { email: currentUser.email },
    });
    if (!author) throw new NotFoundException('Author not found');

    const category = await this.categoryRepository.findOne({
      where: { id: payload.categoryId },
    });
    if(!category) throw new NotFoundException('Category not found');

    const tags = payload.tagIds?.length
      ? await this.tagRepository.find({
          where: { id: In(payload.tagIds) },
        })
      : [];

    const post = this.postRepository.create({
      title: payload.title,
      content: payload.content,
      coverImage: payload.coverImage,
      status: payload.status ?? 'draft',
      author,
      category,
      tags,
    });

    return await this.postRepository.save(post);
  }

  async update(payload: UpdatePostDto): Promise<BlogPost> {
    const post = await this.postRepository.findOne({
      where: { id: payload.id },
      relations: ['tags', 'category', 'author'],
    });
    if (!post) throw new NotFoundException('Post not found');

    const category = await this.categoryRepository.findOne({
      where: { id: payload.categoryId },
    });
    if (payload.categoryId && category) {
      post.category = category;
    }

    if (payload.tagIds) {
      post.tags = await this.tagRepository.find({
        where: { id: In(payload.tagIds) },
      });
    }

    Object.assign(post, payload);
    return await this.postRepository.save(post);
  }

  async getOne(id: number): Promise<BlogPost> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'tags', 'comments', 'likes'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async getPagination(
    page = 1,
    perPage = 10,
    column?: string,
    search?: string,
  ): Promise<{
    data: BlogPost[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const skip = (page - 1) * perPage;
    const where = {};
    if (column && search) {
      where[column] = ILike(`%${search}%`);
    }
    console.log(where, column, search);
    const [data, total] = await this.postRepository.findAndCount({
      where,
      relations: ['author', 'category', 'tags'],
      take: perPage,
      skip,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, perPage };
  }

  async deleteOne(id: number): Promise<BlogPost> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    await this.postRepository.delete(id);
    return post;
  }
}
