import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BlogPost } from '../../blog/post/entities/blog_post.entity';
import { BlogComment } from '../../blog/comments/entities/blog_comment.entity';
import { BlogLike } from '../../blog/like/entities/blog_like.entity';
import { UserCompany } from './user_company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column()
  is_active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;

  @OneToMany(() => BlogPost, (post) => post.author)
  posts: BlogPost[];

  @OneToMany(() => BlogComment, (comment) => comment.user)
  comments: BlogComment[];

  @OneToMany(() => BlogLike, (like) => like.user)
  likes: BlogLike[];
  
  @OneToMany(() => UserCompany, (uc) => uc.user)
  userCompanies: UserCompany[];
}
