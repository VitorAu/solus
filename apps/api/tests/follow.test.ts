import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { CreateServer } from "../src/server";
import { InitTestDatabase, StopTestDatabase } from "./config/database";
import { ApplyMigrations } from "./config/migrations";
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

describe("Analytics routes tests", () => {
  let server: FastifyInstance;
  let database: NodePgDatabase<any>;
  let user: any;
  let secondUser: any;
  let accessToken: any;

  beforeAll(async () => {
    database = await InitTestDatabase();
    await ApplyMigrations(database);

    server = CreateServer(database);
    await server.ready();
  }, 50000);

  beforeEach(async () => {
    const uuid = crypto.randomUUID();
    const seconduuid = crypto.randomUUID();
    const userPayload = {
      name: `test${uuid}`,
      username: `test${uuid}`,
      email: `test${uuid}@test${uuid}.com`,
      birth_date: new Date("2000-01-01"),
      avatar_key: "",
      password: "test",
    };
    const secondUserPayload = {
      name: `test${seconduuid}`,
      username: `test${seconduuid}`,
      email: `test${seconduuid}@test${seconduuid}.com`,
      birth_date: new Date("2000-01-01"),
      avatar_key: "",
      password: "test",
    };

    const registerResponse = await server.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: userPayload,
    });
    const secondRegisterResponse = await server.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: secondUserPayload,
    });
    assert.equal(registerResponse.statusCode, 200);
    assert.equal(secondRegisterResponse.statusCode, 200);

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
    const secondRegisterBody = JSON.parse(secondRegisterResponse.body);
    const loginBody = JSON.parse(loginResponse.body);
    user = registerBody.data;
    secondUser = secondRegisterBody.data;
    accessToken = loginBody.data.accessToken;
  });

  afterAll(async () => {
    await server.close();
    await StopTestDatabase();
  });

  test("/api/v1/follow", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/follow",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
        follows_user_id: secondUser.id,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.user_id, user.id);
    assert.equal(body.data.follows_user_id, secondUser.id);
  });

  test("/api/v1/follow", async () => {
    const followResponse = await server.inject({
      method: "POST",
      url: "/api/v1/follow",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
        follows_user_id: secondUser.id,
      },
    });

    assert.equal(followResponse.statusCode, 200);

    const followBody = JSON.parse(followResponse.body);
    assert.equal(followBody.data.user_id, user.id);
    assert.equal(followBody.data.follows_user_id, secondUser.id);

    const response = await server.inject({
      method: "PATCH",
      url: "/api/v1/follow",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
        follows_user_id: secondUser.id,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.user_id, user.id);
    assert.equal(body.data.follows_user_id, secondUser.id);
  });

  test("/api/v1/follow/user/{user_id}/follows", async () => {
    const followResponse = await server.inject({
      method: "POST",
      url: "/api/v1/follow",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
        follows_user_id: secondUser.id,
      },
    });

    assert.equal(followResponse.statusCode, 200);

    const followBody = JSON.parse(followResponse.body);
    assert.equal(followBody.data.user_id, user.id);
    assert.equal(followBody.data.follows_user_id, secondUser.id);

    const response = await server.inject({
      method: "GET",
      url: `/api/v1/follow/user/${user.id}/follows`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.isNotEmpty(body.data);
  });

  test("/api/v1/follow/user/{user_id}/followers", async () => {
    const followResponse = await server.inject({
      method: "POST",
      url: "/api/v1/follow",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
        follows_user_id: secondUser.id,
      },
    });

    assert.equal(followResponse.statusCode, 200);

    const followBody = JSON.parse(followResponse.body);
    assert.equal(followBody.data.user_id, user.id);
    assert.equal(followBody.data.follows_user_id, secondUser.id);

    const response = await server.inject({
      method: "GET",
      url: `/api/v1/follow/user/${user.id}/followers`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.isEmpty(body.data);
  });

  test("/api/v1/follow/verify/{user_id}/{follows_user_id}", async () => {
    const followResponse = await server.inject({
      method: "POST",
      url: "/api/v1/follow",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
        follows_user_id: secondUser.id,
      },
    });

    assert.equal(followResponse.statusCode, 200);

    const followBody = JSON.parse(followResponse.body);
    assert.equal(followBody.data.user_id, user.id);
    assert.equal(followBody.data.follows_user_id, secondUser.id);

    const response = await server.inject({
      method: "GET",
      url: `/api/v1/follow/verify/${user.id}/${secondUser.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.is_following, true);
    assert.equal(body.data.user_id, user.id);
    assert.equal(body.data.follows_user_id, secondUser.id);
  });

  test("/api/v1/follow/code", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/follow/code",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.user_id, user.id);
  });

  test("/api/v1/follow/verify/code", async () => {
    const followCodeResponse = await server.inject({
      method: "POST",
      url: "/api/v1/follow/code",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        user_id: user.id,
      },
    });

    assert.equal(followCodeResponse.statusCode, 200);

    const followCodeBody = JSON.parse(followCodeResponse.body);
    assert.equal(followCodeBody.data.user_id, user.id);

    const id = followCodeBody.data.id;
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/follow/verify/code",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        id: id,
        user_id: user.id,
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data, true);
  });
});
