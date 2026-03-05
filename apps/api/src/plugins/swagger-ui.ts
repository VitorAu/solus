import { FastifyInstance } from "fastify";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import fp from "fastify-plugin";

async function SwaggerUi(fastify: FastifyInstance) {
  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
  });
}

export const SwaggerUiPlugin = fp(SwaggerUi);
