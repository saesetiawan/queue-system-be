import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogLike } from './entities/blog_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogLike])],
  controllers: [],
  providers: [],
  exports: [],
})
export class LikeModule {}
