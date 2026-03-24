import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  userTable,
  postTable,
  followTable,
  followCodeTable,
} from "@repo/database";

let container: StartedPostgreSqlContainer;
let client: Client;

export async function InitTestDatabase() {
  container = await new PostgreSqlContainer("postgres:16")
    .withDatabase("solus_test")
    .withUsername("solus_user_test")
    .withPassword("solus_user_password_test")
    .start();

  client = new Client({
    connectionString: container.getConnectionUri(),
  });

  await client.connect();

  const database = drizzle(client, {
    schema: {
      userTable,
      postTable,
      followTable,
      followCodeTable,
    },
  });

  return database;
}

export async function StopTestDatabase() {
  await client.end();
  await container.stop();
}
