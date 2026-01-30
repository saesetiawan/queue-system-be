import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitQueueSchema1757060000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ====================
    // COMPANIES
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '40',
            isPrimary: true,
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'email', type: 'varchar', length: '255' },
          { name: 'category', type: 'varchar', length: '255', isNullable: true },
          { name: 'address', type: 'varchar', length: '255', isNullable: true },
          { name: 'mobile', type: 'varchar', length: '50', isNullable: true },
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
    // USER_COMPANIES
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'user_companies',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'user_id', type: 'int' },
          {
            name: 'company_id',
            type: 'varchar',
            length: '40',
          },
          {
            name: 'role',
            type: 'varchar',
            length: '20',
            default: `'operator'`,
          },
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
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['company_id'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // ====================
    // QUEUE_SERVICES
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'queue_services',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '40',
            isPrimary: true,
          },
          {
            name: 'tenant_id',
            type: 'varchar',
            length: '40',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['tenant_id'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // ====================
    // QUEUE_PROCESS
    // ====================
    await queryRunner.createTable(
      new Table({
        name: 'queue_process',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '40',
            isPrimary: true,
          },
          {
            name: 'tenant_id',
            type: 'varchar',
            length: '40',
          },
          {
            name: 'service_id',
            type: 'varchar',
            length: '40',
          },
          { name: 'number', type: 'int' },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: `'waiting'`,
          },
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
            columnNames: ['tenant_id'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['service_id'],
            referencedTableName: 'queue_services',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('queue_process');
    await queryRunner.dropTable('queue_services');
    await queryRunner.dropTable('user_companies');
    await queryRunner.dropTable('companies');
  }
}
