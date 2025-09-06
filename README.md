# Charmander API

API para gerenciamento de lotes de pagamentos.

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)
- [Swagger](https://swagger.io/)

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## ⚙️ Instalação

1.  Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd charmander-api
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

## ▶️ Executando a Aplicação

### Com Docker (Recomendado)

Para iniciar a API e o banco de dados PostgreSQL, execute o comando abaixo. A API estará disponível em `http://localhost:4231`.

```bash
docker-compose up --build
```

### Modo de Desenvolvimento

Para executar a aplicação em modo de desenvolvimento com hot-reload:

```bash
npm run dev
```

A API estará disponível em `http://localhost:4231`.

## 📚 API Endpoints

A documentação completa da API está disponível via Swagger UI. Após iniciar a aplicação, acesse:

[http://localhost:4231/docs](http://localhost:4231/docs)

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento.
- `npm run build`: Compila o código TypeScript para JavaScript.
- `npm run start`: Inicia o servidor em modo de produção (requer build prévio).
- `npm run test`: Executa os testes unitários.
- `npm run test:watch`: Executa os testes em modo de observação.
- `npm run test:coverage`: Gera o relatório de cobertura de testes.
- `npm run lint`: Verifica o código por erros de lint.
- `npm run lint:fix`: Corrige os erros de lint automaticamente.
- `npm run format`: Formata o código com Prettier.
- `npm run format:check`: Verifica se o código está formatado corretamente.
- `npm run typeorm --`: Executa comandos do TypeORM CLI.

---
Desenvolvido para estudo
