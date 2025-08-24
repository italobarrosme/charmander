import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1756044102558 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        `);
    
        await queryRunner.query(`
          CREATE TABLE "lotes" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "codeGasStation" varchar NOT NULL,
            "nameGasStation" varchar NOT NULL,
            "period" jsonb NOT NULL,
            "tax" numeric(5,2) NOT NULL
          )
        `);
    
        await queryRunner.query(`
          CREATE TABLE "payments" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "cpf" varchar NOT NULL,
            "dateTransaction" timestamptz NOT NULL,
            "value" numeric(10,2) NOT NULL,
            "typePayment" varchar NOT NULL,
            "status" varchar NOT NULL,
            "product" varchar NOT NULL,
            "loteId" uuid,
            CONSTRAINT "FK_lote_payment" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON DELETE CASCADE
          )
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "lotes"`);
      }

}
