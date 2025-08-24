# Comandos TypeORM para Migrations

Este documento lista os principais comandos para gerenciar migrations no TypeORM.

### Criar uma nova migration
```bash
npx typeorm migration:create ./src/migrations/NomeDaMigration
```

### Gerar uma migration baseada nas alterações das entidades
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:generate ./src/migrations/NomeDaMigration -d ./src/config/db.ts
```

### Executar migrations pendentes
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:run -d ./src/config/db.ts
```

### Reverter a última migration
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:revert -d ./src/config/db.ts
```

### Mostrar migrations executadas
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:show -d ./src/config/db.ts
```

## Observações Importantes

1. Sempre execute `migration:generate` quando:
   - Criar novas entidades
   - Modificar entidades existentes
   - Adicionar/remover relacionamentos

2. Boas práticas:
   - Revise o código gerado antes de executar
   - Mantenha um histórico organizado de migrations
   - Use nomes descritivos para as migrations
   - Faça backup do banco antes de executar em produção

3. Estrutura do arquivo de migration:
   ```typescript
   export class NomeDaMigration implements MigrationInterface {
       async up(queryRunner: QueryRunner): Promise<void> {
           // Código executado ao aplicar a migration
       }

       async down(queryRunner: QueryRunner): Promise<void> {
           // Código executado ao reverter a migration
       }
   }
   ```
