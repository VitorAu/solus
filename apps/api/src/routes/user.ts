import { UserController } from "@/controller/user";
import { Auth } from "@/hooks/auth";
import {
  ErrorResponseSchema,
  SuccessResponseSchema,
  UserSchema,
} from "@repo/types";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const userController = new UserController();

export async function UserRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", Auth);

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/id/:id",
    {
      schema: {
        tags: ["User"],
        summary: "Get user by id",
        description: "API route to get user by id",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(UserSchema.omit({ password: true })),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: UserSchema.pick({ id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await userController.GetUserById(params.id);

        return res.code(200).send({
          status: "success",
          message: "User found successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get user by id",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/email/:email",
    {
      schema: {
        tags: ["User"],
        summary: "Get user by email",
        description: "API route to get user by email",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(UserSchema.omit({ password: true })),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: UserSchema.pick({ email: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await userController.GetUserById(params.email);

        return res.code(200).send({
          status: "success",
          message: "User found successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get user by email",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/name/:name",
    {
      schema: {
        tags: ["User"],
        summary: "Get user by name",
        description: "API route to get user by name",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(UserSchema.omit({ password: true })),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: UserSchema.pick({ name: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await userController.GetUserById(params.name);

        return res.code(200).send({
          status: "success",
          message: "User found successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get user by name",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/username/:username",
    {
      schema: {
        tags: ["User"],
        summary: "Get user by username",
        description: "API route to get user by username",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(UserSchema.omit({ password: true })),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: UserSchema.pick({ username: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;
        const response = await userController.GetUserById(params.username);

        return res.code(200).send({
          status: "success",
          message: "User found successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get user by username",
          error: String(error),
        });
      }
    },
  );

  // fastify.withTypeProvider<ZodTypeProvider>().patch(
  //   "/update-user/:id",
  //   {
  //     schema: {
  //       tags: ["user"],
  //       summary: "Update user",
  //       description: "API route to update user",
  //       security: [{ BearerAuth: [] }],
  //       response: {
  //         200: SuccessResponseSchema(UserSchema.omit({ password: true })),
  //         400: ErrorResponseSchema,
  //         500: ErrorResponseSchema,
  //       },
  //       params: UserSchema.pick({ id: true }),
  //       body: UserSchema.pick({})
  //     },
  //   },
  //   (req, res) => {},
  // );
}
