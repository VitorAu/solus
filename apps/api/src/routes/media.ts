import { MultipartFile } from "@fastify/multipart";
import {
  ErrorResponseSchema,
  PostMediaSchema,
  PostMediaType,
  SuccessResponseNoDataSchema,
  SuccessResponseSchema,
} from "@repo/types";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { z } from "zod";
import {
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { environment } from "@/config/environment";
import { randomUUID } from "crypto";
import { CreateAwsClient } from "@/config/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PostMediaController } from "@/controller/postMedia";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

type MediaRoutesOpts = {
  database: NodePgDatabase<any>;
};

export function MediaRoutes(fastify: FastifyInstance, opts: MediaRoutesOpts) {
  const postMediaController = new PostMediaController(opts.database);

  // TODO: Review this workflow later, currently the user creates a post, and then using the postId it can send images, but it will be better if the user can upload temporary images and then link them with the post
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/media/upload/post-id/:post_id",
    {
      schema: {
        tags: ["Media"],
        summary: "Upload image files to S3",
        description: "api route to upload image files",
        security: [{ BearerAuth: [] }],
        response: {
          200: SuccessResponseSchema(PostMediaSchema.array()),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        consumes: ["multipart/form-data"],
        params: PostMediaSchema.pick({ post_id: true }),
        body: z.object({
          files: z
            .custom<MultipartFile>()
            .meta({
              type: "string",
              format: "binary",
            })
            .array(),
        }),
      },
    },
    async (req, res) => {
      try {
        const files = Array.isArray(req.body.files)
          ? req.body.files
          : [req.body.files];
        const params = req.params;

        const aws = CreateAwsClient();

        if (!files || files.length === 0) {
          return res.code(400).send({
            status: "error",
            message: "Failed to upload images",
            error: "Image is required",
          });
        }

        let order = 1;
        const awsResponse: Array<
          Pick<PostMediaType, "order" | "media" | "storage_key">
        > = [];
        for (let aux of files) {
          const rawBuffer = await aux.toBuffer();
          const type = await fileTypeFromBuffer(rawBuffer);
          if (!type || !type.mime.startsWith("image/")) {
            return res.code(400).send({
              status: "error",
              message: "Failed to upload images",
              error: "Image format is not supported",
            });
          }

          const buffer = await sharp(rawBuffer)
            .resize({ height: 1920, width: 1080, fit: "contain" })
            .jpeg({ quality: 90 })
            .toBuffer();

          try {
            const putParams: PutObjectCommandInput = {
              Bucket: environment.bucketName,
              Key: `${Date.now()}-${randomUUID()}-${order}-${aux.filename}`,
              Body: buffer,
              ContentType: type.mime,
            };
            const command = new PutObjectCommand(putParams);
            const response = await aws.send(command);
            if (!response) {
              return res.code(400).send({
                status: "error",
                message: "Failed to upload images",
                error: "Failed to store image",
              });
            }

            awsResponse.push({
              order: order,
              media: "IMAGE",
              storage_key: putParams.Key!,
            });

            order++;
          } catch (error) {
            return res.code(500).send({
              status: "error",
              message: "Failed to upload image to s3",
              error: String(error),
            });
          }
        }

        const response = await postMediaController.CreatePostMedia(
          params.post_id,
          awsResponse,
        );

        return res.code(200).send({
          status: "success",
          message: "Successfully uplodaded image",
          data: response,
        });
      } catch (error) {
        res.code(500).send({
          status: "error",
          message: "Failed to upload image",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/media/retrieve/post-id/:post_id",
    {
      schema: {
        tags: ["Media"],
        summary: "Get post media",
        description: "Api route to get uploaded image file",
        response: {
          200: SuccessResponseSchema(PostMediaSchema.array()),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostMediaSchema.pick({ post_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;

        const aws = CreateAwsClient();

        const response = await postMediaController.GetPostMedia(params.post_id);

        for (let aux of response) {
          const getParams: GetObjectCommandInput = {
            Bucket: environment.bucketName,
            Key: aux.storage_key,
          };

          const command = new GetObjectCommand(getParams);
          const url = await getSignedUrl(aws, command, { expiresIn: 60 * 60 });

          aux.url = url;
        }

        return res.code(200).send({
          status: "success",
          message: "Successfully retrieved post media",
          data: response,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to get post media",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/media/delete/post-id/:post_id",
    {
      schema: {
        tags: ["Media"],
        summary: "Delete images",
        description: "Api route to delete image files",
        response: {
          200: SuccessResponseNoDataSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        params: PostMediaSchema.pick({ post_id: true }),
      },
    },
    async (req, res) => {
      try {
        const params = req.params;

        const aws = CreateAwsClient();

        const response = await postMediaController.GetPostMedia(params.post_id);

        for (let aux of response) {
          const getParams: GetObjectCommandInput = {
            Bucket: environment.bucketName,
            Key: aux.storage_key,
          };

          const command = new DeleteObjectCommand(getParams);
          await aws.send(command);
        }

        return res.code(200).send({
          status: "success",
          message: "Successfully deleted post media",
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to delete post media",
          error: String(error),
        });
      }
    },
  );
}
