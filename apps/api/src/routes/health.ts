import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify/types/instance";
import { ErrorResponseSchema, SuccessResponseNoDataSchema } from "@repo/types";
import { database } from "@repo/database";

export async function HealthRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/api",
    {
      schema: {
        tags: ["Health"],
        summary: "API health check",
        description: "Checks if the HTTP API is up",
        response: {
          200: SuccessResponseNoDataSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (_, res) => {
      try {
        return res.code(200).send({
          status: "success",
          message: "API is operational",
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "API is not operational",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/db",
    {
      schema: {
        tags: ["Health"],
        summary: "Database health check",
        description: "Checks database conectivity",
        response: {
          200: SuccessResponseNoDataSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (_, res) => {
      try {
        database.$client.query("SELECT 1");

        return res
          .code(200)
          .send({ status: "success", message: "Database is operational" });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Database is not operational",
          error: String(error),
        });
      }
    },
  );
}
