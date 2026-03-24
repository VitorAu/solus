import { FollowController } from "@/controller/follow";
import { FollowCodeController } from "@/controller/followCode";
import {
  ErrorResponseSchema,
  FollowCodeSchema,
  FollowSchema,
  SuccessResponseSchema,
} from "@repo/types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

type FollowRoutesOpts = {
  database: NodePgDatabase<any>;
};

export function FollowRoutes(fastify: FastifyInstance, opts: FollowRoutesOpts) {
  const followController = new FollowController(opts.database);
  const followCodeController = new FollowCodeController(opts.database);

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "",
    {
      schema: {
        tags: ["Follow"],
        summary: "Follow user",
        description: "Api route to follow user",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(FollowSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: FollowSchema.pick({ user_id: true, follows_user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const response = await followController.Follow(
          body.user_id,
          body.follows_user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "User followed successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to follow user",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/user/:user_id/follows",
    {
      schema: {
        tags: ["Follow"],
        summary: "Get user follows",
        description: "Api route to get user follows",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(z.array(FollowSchema)),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: FollowSchema.pick({ user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await followController.GetFollowsByUserId(
          params.user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "User follows found successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get user following",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/user/:user_id/followers",
    {
      schema: {
        tags: ["Follow"],
        summary: "Get user followers",
        description: "Api route to get user followers",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(z.array(FollowSchema)),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: FollowSchema.pick({ user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await followController.GetFollowersByUserId(
          params.user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "User follows found successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get user following",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/verify/:user_id/:follows_user_id",
    {
      schema: {
        tags: ["Follow"],
        summary: "Verify if user is following",
        description: "Api route to verify if user is following",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(FollowSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: FollowSchema.pick({ user_id: true, follows_user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await followController.GetIsUserFollowing(
          params.user_id,
          params.follows_user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "Follow status verified successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to verify if user is following",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().patch(
    "",
    {
      schema: {
        tags: ["Follow"],
        summary: "Unfollow user",
        description: "Api route to unfollow user",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(FollowSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: FollowSchema.pick({ user_id: true, follows_user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const response = await followController.Unfollow(
          body.user_id,
          body.follows_user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "User unfollowed successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to unfollow user",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/code",
    {
      schema: {
        tags: ["Follow"],
        summary: "Create follow code",
        description: "Api route to create follow code",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(FollowCodeSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: FollowCodeSchema.pick({ user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const response = await followCodeController.CreateFollowCode(
          body.user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "Follow code created successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to create follow code",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/verify/code",
    {
      schema: {
        tags: ["Follow"],
        summary: "Verify follow code",
        description: "Api route to verify follow code",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(z.boolean()),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: FollowCodeSchema.pick({ id: true, user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const response = await followCodeController.ValidateFollowCode(
          body.id,
          body.user_id,
        );

        return res.code(200).send({
          status: "success",
          message: "Follow code created successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to create follow code",
          error: String(error),
        });
      }
    },
  );
}
