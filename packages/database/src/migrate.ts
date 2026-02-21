import "dotenv/config";

async function ApplyMigrations() {
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { migrate } = await import("drizzle-orm/node-postgres/migrator");
  const { Pool } = await import("pg");

  const pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  const database = drizzle(pool);
  await migrate(database, {
    migrationsFolder: "src/migrations",
  });
  await pool.end();
  console.log("✅ Migrations applied");
}

ApplyMigrations().catch((err) => {
  console.error(err);
  process.exit(1);
});
