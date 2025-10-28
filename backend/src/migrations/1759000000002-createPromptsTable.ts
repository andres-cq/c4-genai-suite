import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { schema } from '../domain/database/typeorm.helper';

export class CreatePromptsTable1759000000002 implements MigrationInterface {
  name = 'CreatePromptsTable1759000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create prompts table
    await queryRunner.createTable(
      new Table({
        name: 'prompts',
        schema: schema,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isGlobal',
            type: 'boolean',
            default: false,
          },
          {
            name: 'categoryId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdById',
            type: 'varchar',
          },
          {
            name: 'usageCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Add foreign key to users table
    await queryRunner.createForeignKey(
      `${schema}.prompts`,
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        referencedSchema: schema,
        onDelete: 'CASCADE',
        name: 'FK_prompts_createdById',
      }),
    );

    // Add foreign key to prompt_categories table
    await queryRunner.createForeignKey(
      `${schema}.prompts`,
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'prompt_categories',
        referencedSchema: schema,
        onDelete: 'SET NULL',
        name: 'FK_prompts_categoryId',
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`${schema}.prompts`, true);
  }
}
