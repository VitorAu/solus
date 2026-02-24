import { UserController } from "@/controller/user";
import {
  ErrorResponseSchema,
  SuccessResponseNoDataSchema,
  SuccessResponseSchema,
  UserSchema,
} from "@repo/types";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify/types/instance";
import { z } from "zod";

const userController = new UserController();

export async function AuthRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Create user",
        description: "API route to create user",
        response: {
          200: SuccessResponseSchema(UserSchema.omit({ password: true })),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: UserSchema.pick({
          email: true,
          name: true,
          username: true,
          avatar_url: true,
          birthdate: true,
          password: true,
        }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const response = await userController.CreateUser(body);

        return res.code(200).send({
          status: "success",
          message: "User created successfully",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to create user",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login into user",
        description: "API route to login into user",
        response: {
          200: SuccessResponseSchema(
            z.object({
              user: UserSchema.omit({ password: true }),
              accessToken: z.string(),
            }),
          ),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        body: UserSchema.pick({
          email: true,
          password: true,
        }),
      },
    },
    async (req, res) => {
      try {
        const body = req.body;
        const user = await userController.GetUserByEmail(body.email);
        if (!user) {
          return res.code(400).send({
            status: "error",
            message: "Failed to login",
            error: "Failed to find user",
          });
        }

        const isPasswordValid = await userController.VerifyPassword(
          user.id,
          body.password,
        );
        if (!isPasswordValid) {
          return res.code(400).send({
            status: "error",
            message: "Failed to login",
            error: "Invalid credentials",
          });
        }

        const accessToken = fastify.jwt.sign(
          { sub: user.id, userEmail: user.email, type: "access" },
          { expiresIn: "15m" },
        );

        const refreshToken = fastify.jwt.sign(
          { sub: user.id, userEmail: user.email, type: "refresh" },
          { expiresIn: "7d" },
        );

        res.setCookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        });

        return res.code(200).send({
          status: "success",
          message: "User logged in successfully",
          data: {
            user,
            accessToken,
          },
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to login",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/logout",
    {
      schema: {
        tags: ["Auth"],
        summary: "Logout user",
        description: "API route to logout",
        response: {
          200: SuccessResponseNoDataSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (_, res) => {
      try {
        res.clearCookie("refreshToken", {
          path: "/",
        });

        return res.code(200).send({
          status: "success",
          message: "User logged out successfully",
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to logout user",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/refresh",
    {
      schema: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description: "API route to refresh access token",
        response: {
          200: SuccessResponseSchema(
            z.object({
              accessToken: z.string(),
            }),
          ),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (req, res) => {
      try {
        const token = req.cookies.refreshToken;

        if (!token) {
          return res.code(400).send({
            status: "error",
            message: "Failed to refresh access token",
            error: "Missing refresh token",
          });
        }

        let payload: any;

        try {
          payload = fastify.jwt.verify(token);
          if (payload.type !== "refresh") {
            return res.code(400).send({
              status: "error",
              message: "Failed to refresh access token",
              error: "Invalid refresh token type",
            });
          }
        } catch (error) {
          return res.code(400).send({
            status: "error",
            message: "Failed to refresh access token",
            error: String(error),
          });
        }

        const newAccessToken = fastify.jwt.sign(
          { sub: payload.sub },
          { expiresIn: "15m" },
        );

        return res.send({
          status: "success",
          message: "Access token refreshed",
          data: {
            accessToken: newAccessToken,
          },
        });
      } catch (error) {
        res.code(500).send({
          status: "error",
          message: "Failed to refresh access token",
          error: String(error),
        });
      }
    },
  );
}
