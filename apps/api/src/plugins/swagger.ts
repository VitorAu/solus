import { FastifyInstance } from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import fp from "fastify-plugin";

async function Swagger(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Typus API",
        description: "",
        version: "0.1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });
}

export const SwaggerPlugin = fp(Swagger);
