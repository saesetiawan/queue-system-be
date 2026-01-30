import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { BlogPost } from '../../post/entities/blog_post.entity';
import { User } from '../../../auth/entitites/user.entity';

@Entity('blog_comments')
export class BlogComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => BlogPost, (post) => post.comments, { onDelete: 'CASCADE' })
  post: BlogPost;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => BlogComment, (comment) => comment.id, { nullable: true })
  parent: BlogComment;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;
}
