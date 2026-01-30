import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogTag } from './entities/blog_tag.entity';
import { TagController } from './controllers/tag.controller';
import { TagService } from './services/tag.service';
import { TagUseCase } from './usecases/tag.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([BlogTag])],
  controllers: [TagController],
  providers: [TagService, TagUseCase],
  exports: [TagUseCase, TypeOrmModule],
})
export class TagModule {}
