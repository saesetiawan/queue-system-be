import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BlogPost } from '../../post/entities/blog_post.entity';
import { User } from '../../../auth/entitites/user.entity';

@Entity('blog_likes')
export class BlogLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BlogPost, (post) => post.likes, { onDelete: 'CASCADE' })
  post: BlogPost;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;
}
