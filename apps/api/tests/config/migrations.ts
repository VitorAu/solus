import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";

export async function ApplyMigrations(database: NodePgDatabase<any>) {
  await migrate(database, {
    migrationsFolder: path.resolve(
      __dirname,
      "../../../../packages/database/src/migrations",
    ),
  });
}
