import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog_post.entity';
import { BlogPostController } from './controllers/blog_post.controller';
import { BlogPostService } from './services/blog_post.service';
import { BlogPostUseCase } from './usecases/blog_post.usecase';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    CategoryModule,
    TagModule,
    AuthModule,
    TypeOrmModule.forFeature([BlogPost]),
  ],
  controllers: [BlogPostController],
  providers: [BlogPostService, BlogPostUseCase],
  exports: [BlogPostService, BlogPostUseCase],
})
export class PostModule {}
