import crypto from "crypto";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { FastifyInstance } from "fastify";
import { afterAll, assert, beforeAll, describe, test } from "vitest";
import { CreateServer } from "../src/server";
import { InitTestDatabase, StopTestDatabase } from "./config/database";
import { ApplyMigrations } from "./config/migrations";

describe("Auth route tests", () => {
  let server: FastifyInstance;
  let database: NodePgDatabase<any>;
  let user: any;

  beforeAll(async () => {
    database = await InitTestDatabase();
    await ApplyMigrations(database);

    server = CreateServer(database);
    await server.ready();

    const uuid = crypto.randomUUID();
    user = {
      name: `test${uuid}`,
      username: `test${uuid}`,
      email: `test${uuid}@test${uuid}.com`,
      birth_date: new Date("2000-01-01"),
      avatar_key: "",
      password: "test",
    };
  }, 50000);

  afterAll(async () => {
    await server.close();
    await StopTestDatabase();
  });

  test("/api/v1/auth/register", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: user,
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.name, user.name);
  });

  test("/api/v1/auth/login", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: user.email,
        password: "test",
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.user.name, user.name);
  });

  test("/api/v1/auth/logout", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/auth/logout",
    });

    assert.equal(response.statusCode, 200);
  });

  test("/api/v1/auth/refresh", async () => {
    const loginResponse = await server.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: user.email,
        password: "test",
      },
    });

    assert.equal(loginResponse.statusCode, 200);

    const loginBody = JSON.parse(loginResponse.body);
    assert.equal(loginBody.data.user.name, user.name);

    const cookie = loginResponse.headers["set-cookie"];
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/auth/refresh",
      headers: {
        cookie: cookie,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.exists(body.data.accessToken);
  });
});
