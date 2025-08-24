import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedData1756044182894 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // cria 5 lotes
        await queryRunner.query(`
          INSERT INTO "lotes" ("id", "codeGasStation", "nameGasStation", "period", "tax")
          VALUES
          (gen_random_uuid(), '001', 'Posto Recife', '{"start":"2025-08-01T00:00:00.000Z","end":"2025-08-31T23:59:59.000Z"}', 2.5),
          (gen_random_uuid(), '002', 'Posto Olinda', '{"start":"2025-08-05T00:00:00.000Z","end":"2025-08-20T23:59:59.000Z"}', 3.0),
          (gen_random_uuid(), '003', 'Posto Paulista', '{"start":"2025-08-10T00:00:00.000Z","end":"2025-08-25T23:59:59.000Z"}', 1.5),
          (gen_random_uuid(), '004', 'Posto Jaboatão', '{"start":"2025-08-15T00:00:00.000Z","end":"2025-08-30T23:59:59.000Z"}', 4.0),
          (gen_random_uuid(), '005', 'Posto Abreu e Lima', '{"start":"2025-08-20T00:00:00.000Z","end":"2025-08-31T23:59:59.000Z"}', 2.0)
        `)
    
        // cria 10 pagamentos (2 para cada lote)
        await queryRunner.query(`
          INSERT INTO "payments" ("id","cpf","dateTransaction","value","typePayment","status","product","loteId")
          VALUES
          (gen_random_uuid(),'12345678900','2025-08-15T12:00:00.000Z',100,'PIX','PEDDING','SUPPLY',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='001')),
          (gen_random_uuid(),'98765432100','2025-08-16T12:00:00.000Z',250,'CREDIT','PEDDING','SERVICES',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='001')),
    
          (gen_random_uuid(),'11122233344','2025-08-17T10:30:00.000Z',180,'MERCADO_PAGO','PEDDING','OTHERS',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='002')),
          (gen_random_uuid(),'55566677788','2025-08-18T09:00:00.000Z',300,'PIX','PEDDING','SUPPLY',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='002')),
    
          (gen_random_uuid(),'22233344455','2025-08-20T15:45:00.000Z',120,'CREDIT','PEDDING','SERVICES',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='003')),
          (gen_random_uuid(),'66677788899','2025-08-21T16:00:00.000Z',500,'PIX','PEDDING','SUPPLY',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='003')),
    
          (gen_random_uuid(),'33344455566','2025-08-22T08:00:00.000Z',75,'MERCADO_PAGO','PEDDING','OTHERS',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='004')),
          (gen_random_uuid(),'77788899900','2025-08-23T11:20:00.000Z',60,'PIX','PEDDING','SUPPLY',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='004')),
    
          (gen_random_uuid(),'44455566677','2025-08-24T14:00:00.000Z',400,'CREDIT','PEDDING','SERVICES',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='005')),
          (gen_random_uuid(),'88899900011','2025-08-25T18:10:00.000Z',220,'PIX','PEDDING','SUPPLY',(SELECT "id" FROM "lotes" WHERE "codeGasStation"='005'))
        `)
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "payments"`)
        await queryRunner.query(`DELETE FROM "lotes"`)
      }
}
