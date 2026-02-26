import { aws } from "@/config/aws";
import { environment } from "@/config/environment";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MultipartFile } from "@fastify/multipart";
import { ErrorResponseSchema, SuccessResponseSchema } from "@repo/types";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";
import sharp from "sharp";

export function MediaRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/upload",
    {
      schema: {
        tags: ["Media"],
        summary: "Upload images to s3",
        description: "Api route to upload image files to s3",
        response: {
          200: SuccessResponseSchema(
            z
              .object({ index: z.number(), key: z.string(), url: z.string() })
              .array(),
          ),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        consumes: ["multipart/form-data"],
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
        const files = req.body.files;
        if (!files) {
          return res.code(400).send({
            status: "error",
            message: "Failed to upload images",
            error: "Image is required",
          });
        }

        let index = 1;
        const responses: { index: number; key: string; url: string }[] = [];
        for (let file of files) {
          const rawBuffer = await file.toBuffer();
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
              Key: `tmp/${Date.now()}-${randomUUID()}-${index}-${file.filename}`,
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

            responses.push({
              index: index,
              key: putParams.Key!,
              url: `https://${environment.bucketName}.s3.${environment.bucketRegion}.amazonaws.com/${putParams.Key}`,
            });

            index++;
          } catch (error) {
            return res.code(500).send({
              status: "error",
              message: "Failed to upload image to s3",
              error: String(error),
            });
          }
        }

        return res.code(200).send({
          status: "success",
          message: "Uploaded Image successfully",
          data: responses,
        });
      } catch (error) {
        return res.code(500).send({
          status: "error",
          message: "Failed to upload image",
          error: String(error),
        });
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/post/:postId",
    {
      schema: {
        tags: ["Media"],
        summary: "Get uploaded image",
        description: "Api route to get uploaded image file",
        response: {
          200: SuccessResponseSchema(
            z
              .object({ index: z.number(), key: z.string(), url: z.string() })
              .array(),
          ),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        consumes: ["multipart/form-data"],
        params: z.object({
          postId: z.uuid(),
        }),
      },
    },
    async (req, res) => {
      // TODO: need to finish postMedia routes and post routes first, but atleast i can upload images :)
      // use the post id to retrieve all the images since the postMedia type on the database has a reference to the post
      // try {
      //   const getParams: GetObjectCommandInput = {
      //     Bucket: environment.bucketName,
      //   };
      //   const command = new GetObjectCommand(getParams);
      //   const url = await getSignedUrl(client, command, { expiresIn: 3600 });
      // } catch (error) {
      //   return res.code(500).send({
      //     status: "error",
      //     message: "Failed to fetch image",
      //     error: String(error),
      //   });
      // }
    },
  );

  fastify.post(
    "/confirm",
    {
      schema: {
        tags: ["Media"],
        summary: "Confirm temporary images",
        description: "Api route to confirm temporary image files",
        response: {
          200: SuccessResponseSchema(
            z
              .object({ index: z.number(), key: z.string(), url: z.string() })
              .array(),
          ),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        consumes: ["multipart/form-data"],
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
    async () => {},
  );

  fastify.post(
    "/delete",
    {
      schema: {
        tags: ["Media"],
        summary: "Delete image",
        description: "Api route to delete image files",
        response: {
          200: SuccessResponseSchema(
            z
              .object({ index: z.number(), key: z.string(), url: z.string() })
              .array(),
          ),
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
        consumes: ["multipart/form-data"],
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
    async () => {},
  );
}
