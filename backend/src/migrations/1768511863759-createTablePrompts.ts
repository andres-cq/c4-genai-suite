import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePrompts1768511863759 implements MigrationInterface {
  name = 'CreateTablePrompts1768511863759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_chat"."prompts" (
            "id" SERIAL NOT NULL, 
            "title" character varying(255) NOT NULL, 
            "description" text, 
            "promptText" text NOT NULL, 
            "isFavorite" boolean NOT NULL DEFAULT false, 
            "userId" character varying NOT NULL, 
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_21f33798862975179e40b216a1d" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_chat"."prompts" ADD CONSTRAINT "FK_fd2aed4018953e15ce70f65b427" FOREIGN KEY ("userId") REFERENCES "company_chat"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company_chat"."prompts" DROP CONSTRAINT "FK_fd2aed4018953e15ce70f65b427"`);
    await queryRunner.query(`DROP TABLE "company_chat"."prompts"`);
  }
}
