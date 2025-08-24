import { DataSource } from "typeorm";
import { Payment } from "../entities/Payment";
import { Lote } from "../entities/Lote";

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "payments",
  synchronize: false, // ⚠️ apenas para dev
  logging: true, // Habilitando logs para debug
  entities: [Payment, Lote],
  migrations: ["dist/migrations/*.js"],
  migrationsRun: true,
});

export async function connectDB() {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      await AppDataSource.initialize();
      console.log("📦 Database connected");
      return AppDataSource;
    } catch (error) {
      console.log(error, "error");
      retries++;
      console.log(
        `❌ Database connection failed. Retrying... (${retries}/${MAX_RETRIES})`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  throw new Error("❌ Database connection failed after all retries");
}
