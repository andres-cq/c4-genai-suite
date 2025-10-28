import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { schema } from '../domain/database/typeorm.helper';

export class CreatePromptCategoriesTable1759000000001 implements MigrationInterface {
  name = 'CreatePromptCategoriesTable1759000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create prompt_categories table
    await queryRunner.createTable(
      new Table({
        name: 'prompt_categories',
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
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
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

    // Seed predefined categories
    await queryRunner.query(`
      INSERT INTO "${schema}"."prompt_categories" ("name", "description") VALUES
        ('Writing', 'Prompts for writing, editing, and content creation'),
        ('Analysis', 'Prompts for analyzing information and data'),
        ('Brainstorming', 'Prompts for generating ideas and creative thinking'),
        ('Learning', 'Prompts for explaining concepts and educational content'),
        ('Planning', 'Prompts for planning, organizing, and structuring'),
        ('Problem Solving', 'Prompts for solving problems and troubleshooting'),
        ('Translation', 'Prompts for translating and language tasks'),
        ('General', 'General purpose prompts')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`${schema}.prompt_categories`, true);
  }
}
