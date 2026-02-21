import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/migrations",
  schema: "./src/schemas/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,

    ssl:
      process.env.NODE_ENVIRONMENT === "development"
        ? false
        : { rejectUnauthorized: false },
  },
});
