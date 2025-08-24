FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar dependências de build
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Configurar ambiente
ENV NODE_ENV=production
ENV TS_NODE_PROJECT=tsconfig.json

# Iniciar aplicação
CMD ["node", "--require", "ts-node/register", "dist/index.js"]
