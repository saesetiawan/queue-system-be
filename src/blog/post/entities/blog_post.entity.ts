import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../../../auth/entitites/user.entity';
import { BlogCategory } from '../../category/entites/blog_category.entity';
import { BlogTag } from '../../tag/entities/blog_tag.entity';
import { BlogComment } from '../../comments/entities/blog_comment.entity';
import { BlogLike } from '../../like/entities/blog_like.entity';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true, name: 'cover_image' })
  coverImage: string;

  @Column({ default: 'draft' })
  status: string; // 'draft' | 'published'

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => BlogCategory, (category) => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: BlogCategory;

  @ManyToMany(() => BlogTag, (tag) => tag.posts, { cascade: true })
  @JoinTable({
    name: 'blog_post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: BlogTag[];

  @OneToMany(() => BlogComment, (comment) => comment.post)
  comments: BlogComment[];

  @OneToMany(() => BlogLike, (like) => like.post)
  likes: BlogLike[];

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
