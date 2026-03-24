import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { CreateServer } from "../src/server";
import { InitTestDatabase, StopTestDatabase } from "./config/database";
import { ApplyMigrations } from "./config/migrations";
import { UserController } from "../src/controller/user";
import {
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  test,
  assert,
} from "vitest";
import { FastifyInstance } from "fastify/types/instance";
import crypto from "crypto";

describe("User routes tests", () => {
  let server: FastifyInstance;
  let database: NodePgDatabase<any>;
  let userController;
  let user: any;
  let accessToken: any;

  beforeAll(async () => {
    database = await InitTestDatabase();
    await ApplyMigrations(database);

    server = CreateServer(database);
    await server.ready();
  }, 50000);

  beforeEach(async () => {
    const uuid = crypto.randomUUID();
    const userPayload = {
      name: `test${uuid}`,
      username: `test${uuid}`,
      email: `test${uuid}@test${uuid}.com`,
      birth_date: new Date("2000-01-01"),
      avatar_key: "",
      password: "test",
    };

    const registerResponse = await server.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: userPayload,
    });
    assert.equal(registerResponse.statusCode, 200);

    const loginResponse = await server.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: userPayload.email,
        password: userPayload.password,
      },
    });
    assert.equal(loginResponse.statusCode, 200);

    const registerBody = JSON.parse(registerResponse.body);
    const loginBody = JSON.parse(loginResponse.body);
    user = registerBody.data;
    accessToken = loginBody.data.accessToken;
  });

  afterAll(async () => {
    await server.close();
    await StopTestDatabase();
  });

  test("/api/v1/user/id/:id", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/user/id/${user.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.id, user.id);
  });

  test("/api/v1/user/name/:name", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/user/name/${user.name}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.name, user.name);
  });

  test("/api/v1/user/username/:username", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/user/username/${user.username}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.username, user.username);
  });

  test("/api/v1/user/email/:email", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/user/email/${user.email}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.email, user.email);
  });

  test("/api/v1/user/update-user/{id}", async () => {
    const newName = "newTest";
    const response = await server.inject({
      method: "PATCH",
      url: `/api/v1/user/update-user/${user.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        name: newName,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.name, newName);
  });

  test("/api/v1/user/update-password/{id}", async () => {
    userController = new UserController(database);

    const newPassword = "newTest";
    const response = await server.inject({
      method: "PUT",
      url: `/api/v1/user/update-password/${user.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        password: "test",
        newPassword: newPassword,
      },
    });

    assert.equal(response.statusCode, 200);

    const isValid = await userController.VerifyPassword(user.id, newPassword);
    assert.equal(isValid, true);
  });

  test("/api/v1/user/delete/{id}", async () => {
    const response = await server.inject({
      method: "POST",
      url: `/api/v1/user/delete/${user.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });
});
