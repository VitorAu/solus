import { FollowAnalyticsController } from "@/controller/followAnalytics";
import { Auth } from "@/hooks/auth";
import {
  ErrorResponseSchema,
  FollowAnalyticsSchema,
  SuccessResponseSchema,
} from "@repo/types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

type AnalyticRoutesOpts = {
  database: NodePgDatabase<any>;
};

export function AnalyticRoutes(
  fastify: FastifyInstance,
  opts: AnalyticRoutesOpts,
) {
  const followAnalyticsController = new FollowAnalyticsController(
    opts.database,
  );
  fastify.addHook("preHandler", Auth);

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/follow",
    {
      schema: {
        tags: ["Analytics"],
        summary: "Create follow analytics",
        description: "Api route to create follow analytics",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(FollowAnalyticsSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: FollowAnalyticsSchema.pick({ user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const response = await followAnalyticsController.CreateFollowAnalytics(
          body.user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "Follow analytics created successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to create follow analytics",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/follow",
    {
      schema: {
        tags: ["Analytics"],
        summary: "Get follow analytics",
        description: "Api route to get follow analytics",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(FollowAnalyticsSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: FollowAnalyticsSchema.pick({ user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await followAnalyticsController.GetFollowAnalytics(
          params.user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "Follow analytics found successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to find follow analytics",
          error: String(error),
        });
      }
    },
  );
}
