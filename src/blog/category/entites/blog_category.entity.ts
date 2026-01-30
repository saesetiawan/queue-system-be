import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BlogPost } from '../../post/entities/blog_post.entity';

@Entity('blog_categories')
export class BlogCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => BlogPost, (post) => post.category)
  posts: BlogPost[];
}
