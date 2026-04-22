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

describe("Post route tests", () => {
  let server: FastifyInstance;
  let database: NodePgDatabase<any>;
  let user: any;
  let post: any;
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

    const postResponse = await server.inject({
      method: "POST",
      url: "/api/v1/post",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        description: "test",
      },
    });

    assert.equal(postResponse.statusCode, 200);

    const postBody = JSON.parse(postResponse.body);
    post = postBody.data;
  });

  afterAll(async () => {
    await server.close();
    await StopTestDatabase();
  });

  test("/api/v1/post", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/post",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        description: "test",
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.description, "test");
  });

  test("/api/v1/post/post-id/{id}", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/post/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });

  test("/api/v1/post/user-id/{user_id}", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/post/user-id/${user.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });

  test("/api/v1/post/update/post-id/{id}", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: `/api/v1/post/update/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        description: "test2",
      },
    });

    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.data.description, "test2");
  });

  test("/api/v1/post/delete/post-id/{id}", async () => {
    const response = await server.inject({
      method: "POST",
      url: `/api/v1/post/like/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });

  test("/api/v1/post/like/post-id/{post_id}", async () => {
    const response = await server.inject({
      method: "POST",
      url: `/api/v1/post/like/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });

  test("/api/v1/post/likes/post-id/{post_id}", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/post/likes/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });

  test("/api/v1/post/like-relationship/user-id/{user_id}/post-id/{post_id}", async () => {
    const likeResponse = await server.inject({
      method: "POST",
      url: `/api/v1/post/like/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(likeResponse.statusCode, 200);

    const response = await server.inject({
      method: "GET",
      url: `/api/v1/post/like-relationship/user-id/${user.id}/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });

  test("/api/v1/post/unlike/post-id/{post_id}", async () => {
    const likeResponse = await server.inject({
      method: "POST",
      url: `/api/v1/post/like/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(likeResponse.statusCode, 200);


    const response = await server.inject({
      method: "POST",
      url: `/api/v1/post/unlike/post-id/${post.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.statusCode, 200);
  });
});
