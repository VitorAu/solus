import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { FastifyInstance } from "fastify";
import { afterAll, assert, beforeAll, describe, test } from "vitest";
import { InitTestDatabase, StopTestDatabase } from "./config/database";
import { ApplyMigrations } from "./config/migrations";
import { CreateServer } from "../src/server";

describe("Server health route tests", () => {
  let server: FastifyInstance;
  let database: NodePgDatabase<any>;

  beforeAll(async () => {
    database = await InitTestDatabase();
    await ApplyMigrations(database);

    server = CreateServer(database);
    await server.ready();
  }, 50000);

  afterAll(async () => {
    await server.close();
    await StopTestDatabase();
  });

  test("/api/v1/health/api", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/health/api",
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);

    assert.deepEqual(body, {
      status: "success",
      message: "API is operational",
    });
  });
});
