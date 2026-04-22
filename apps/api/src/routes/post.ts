import { PostController } from "@/controller/post";
import { PostLikeController } from "@/controller/postLike";
import { Auth } from "@/hooks/auth";
import {
  ErrorResponseSchema,
  PostLikeSchema,
  PostSchema,
  SuccessResponseNoDataSchema,
  SuccessResponseSchema,
} from "@repo/types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

type PostRoutesOpts = {
  database: NodePgDatabase<any>;
};

export function PostRoutes(fastify: FastifyInstance, opts: PostRoutesOpts) {
  const postController = new PostController(opts.database);
  const postLikeController = new PostLikeController(opts.database);

  fastify.addHook("preHandler", Auth);

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "",
    {
      preHandler: [Auth],
      schema: {
        tags: ["Post"],
        summary: "Create post",
        description: "Api route to create a post",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: PostSchema.pick({ description: true }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const userId = (req.user as any).sub;

        const response = await postController.CreatePost(
          userId,
          body.description,
        );

        return res.code(200).send({
          status: "success",
          message: "Successfully created post",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to create post",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/post-id/:id",
    {
      schema: {
        tags: ["Post"],
        summary: "Get post by post id",
        description: "Api route to get post by post id",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostSchema.pick({ id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;

        const response = await postController.GetPostById(params.id);

        return res.code(200).send({
          status: "success",
          message: "Successfully found post by id",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get post by id",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/user-id/:user_id",
    {
      schema: {
        tags: ["Post"],
        summary: "Get post by user id",
        description: "Api route to get posts by user id",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostSchema.array()),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostSchema.pick({ user_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;

        const response = await postController.GetPostByUserId(params.user_id);

        return res.code(200).send({
          status: "success",
          message: "Successfully found posts by user id",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed go get posts by user id",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().patch(
    "/update/post-id/:id",
    {
      preHandler: [Auth],
      schema: {
        tags: ["Post"],
        summary: "Update post",
        description: "Api route to update post",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostSchema.pick({ id: true }),
        body: PostSchema.pick({ description: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const body = req.body;
        const userId = (req.user as any).sub;

        const response = await postController.UpdatePost(
          params.id,
          userId,
          body.description,
        );

        return res.code(200).send({
          status: "success",
          message: "Successfully updated post",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to update post",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/delete/post-id/:id",
    {
      preHandler: [Auth],
      schema: {
        tags: ["Post"],
        summary: "Delete post",
        description: "Api route to delete post",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseNoDataSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostSchema.pick({ id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const userId = (req.user as any).sub;

        await postController.DeletePost(params.id, userId);

        return res.code(200).send({
          status: "success",
          message: "Successfully deleted post",
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to delete post",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/like/post-id/:post_id",
    {
      preHandler: [Auth],
      schema: {
        tags: ["Post"],
        summary: "Like post",
        description: "Api route to like post",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostLikeSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostLikeSchema.pick({ post_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const userId = (req.user as any).sub;

        const response = await postLikeController.Like(params.post_id, userId);

        return res.code(200).send({
          status: "success",
          message: "Successfully liked post",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to like post",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/likes/post-id/:post_id",
    {
      schema: {
        tags: ["Post"],
        summary: "Get likes by post id",
        description: "Api route to get likes by post id",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostLikeSchema.array()),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostLikeSchema.pick({ post_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;

        const response = await postLikeController.GetLikeByPostId(
          params.post_id,
        );

        return res.code(200).send({
          status: "success",
          message: "Successfully found likes by post id",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get likes by post id",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/like-relationship/user-id/:user_id/post-id/:post_id",
    {
      schema: {
        tags: ["Post"],
        summary: "Get user like relationship",
        description: "Api route to get user like relationship",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostLikeSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostLikeSchema.pick({ user_id: true, post_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;

        const response = await postLikeController.GetUserLikeRelationship(
          params.user_id,
          params.post_id,
        );

        return res.code(200).send({
          status: "success",
          message: "Successfully found user like relationship",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get user like relationship",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/unlike/post-id/:post_id",
    {
      preHandler: [Auth],
      schema: {
        tags: ["Post"],
        summary: "Unlike post",
        description: "Api route to unlike post",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostLikeSchema),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostLikeSchema.pick({ post_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const userId = (req.user as any).sub;

        const response = await postLikeController.Unlike(
          params.post_id,
          userId,
        );

        return res.code(200).send({
          status: "success",
          message: "Successfully unliked post",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to unlike post",
          error: String(error),
        });
      }
    },
  );
}
