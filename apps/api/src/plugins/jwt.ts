import { FastifyInstance } from "fastify";
import { fastifyJwt } from "@fastify/jwt";
import { environment } from "@config/environment";
import fp from "fastify-plugin";

async function Jwt(fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: environment.jwtSecret,
  });
}

export const JwtPlugin = fp(Jwt);
