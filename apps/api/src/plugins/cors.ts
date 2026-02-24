import { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fp from "fastify-plugin";

async function Cors(fastify: FastifyInstance) {
  await fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}

export const CorsPlugin = fp(Cors);
