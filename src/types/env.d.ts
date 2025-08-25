declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT: string
      DB_HOST: string
      DB_PORT: string
      DB_USER: string
      DB_PASS: string
      DB_NAME: string
      // Adicione outras variáveis de ambiente que você usa
    }
  }
}

export {}
