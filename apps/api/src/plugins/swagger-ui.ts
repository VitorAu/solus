import { FastifyInstance } from "fastify";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import fp from "fastify-plugin";

function SwaggerUi(fastify: FastifyInstance) {
  fastify.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
  });
}

export const SwaggerUiPlugin = fp(SwaggerUi);
