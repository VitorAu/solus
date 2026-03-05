import { FastifyInstance } from "fastify";
import { fastifyJwt } from "@fastify/jwt";
import cookie from "@fastify/cookie";
import fp from "fastify-plugin";
import { environment } from "@/config/environment";

async function Jwt(fastify: FastifyInstance) {
  await fastify.register(cookie);

  await fastify.register(fastifyJwt, {
    secret: environment.jwtSecret,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
  });
}

export const JwtPlugin = fp(Jwt);
