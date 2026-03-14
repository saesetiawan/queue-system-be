import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableColumn } from 'typeorm/schema-builder/table/TableColumn';

export class addColumnLastIdQueueService1756888229999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ====================
    // COMPANIES
    // ====================
    await queryRunner.addColumn(
      'queue_services',
      new TableColumn({
        name: 'last_id',
        type: 'varchar',
        length: '60',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('queue_services', 'queue_services');
  }
}
