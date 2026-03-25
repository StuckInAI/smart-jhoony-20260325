import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateHistoryTable17110101000001 implements MigrationInterface {
  name = 'CreateHistoryTable17110101000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "calculation_history" (
        "id" varchar(21) PRIMARY KEY,
        "expression" text NOT NULL,
        "result" float NOT NULL,
        "sessionId" varchar(100),
        "timestamp" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "calculation_history"`)
  }
}
