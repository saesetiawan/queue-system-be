import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitBlogSchema1757059199999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ====================
    // USERS
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'blog_users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar', length: '100' },
          { name: 'role', type: 'varchar', default: `'user'` },
          { name: 'bio', type: 'text', isNullable: true },
          { name: 'avatar_url', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // ====================
    // CATEGORIES
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'blog_categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isUnique: true },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
        ],
      }),
    );

    // ====================
    // TAGS
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'blog_tags',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isUnique: true },
          { name: 'slug', type: 'varchar', isUnique: true },
        ],
      }),
    );

    // ====================
    // POSTS
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'blog_posts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar' },
          { name: 'content', type: 'text' },
          { name: 'cover_image', type: 'varchar', isNullable: true },
          { name: 'status', type: 'varchar', default: `'draft'` },
          { name: 'author_id', type: 'int' },
          { name: 'category_id', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['author_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['category_id'],
            referencedTableName: 'blog_categories',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );

    // ====================
    // POST_TAGS (Many-to-Many)
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'blog_post_tags',
        columns: [
          { name: 'post_id', type: 'int', isPrimary: true },
          { name: 'tag_id', type: 'int', isPrimary: true },
        ],
        foreignKeys: [
          {
            columnNames: ['post_id'],
            referencedTableName: 'blog_posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['tag_id'],
            referencedTableName: 'blog_tags',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // ====================
    // COMMENTS
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'blog_comments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'content', type: 'text' },
          { name: 'post_id', type: 'int' },
          { name: 'user_id', type: 'int' },
          { name: 'parent_id', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['post_id'],
            referencedTableName: 'blog_posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'blog_users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['parent_id'],
            referencedTableName: 'blog_comments',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // ====================
    // LIKES
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'blog_likes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'post_id', type: 'int' },
          { name: 'user_id', type: 'int' },
        ],
        foreignKeys: [
          {
            columnNames: ['post_id'],
            referencedTableName: 'blog_posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'blog_users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('blog_likes');
    await queryRunner.dropTable('blog_comments');
    await queryRunner.dropTable('blog_post_tags');
    await queryRunner.dropTable('blog_posts');
    await queryRunner.dropTable('blog_tags');
    await queryRunner.dropTable('blog_categories');
    await queryRunner.dropTable('blog_users');
  }
}
