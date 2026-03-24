import { FollowAnalyticController } from "@/controller/followAnalytics";
import { Auth } from "@/hooks/auth";
import {
  ErrorResponseSchema,
  FollowAnalyticSchema,
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
  const followAnalyticController = new FollowAnalyticController(opts.database);
  fastify.addHook("preHandler", Auth);

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/follow/:user_id",
    {
      schema: {
        tags: ["Analytics"],
        summary: "Get follow analytics",
        description: "Api route to get follow analytics",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(FollowAnalyticSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: FollowAnalyticSchema.pick({ user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await followAnalyticController.GetFollowAnalytic(
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
