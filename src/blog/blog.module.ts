import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comments/comment.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [CategoryModule, CommentModule, PostModule, LikeModule, TagModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class BlogModule {}
