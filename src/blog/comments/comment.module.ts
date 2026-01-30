import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog_comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogComment])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommentModule {}
