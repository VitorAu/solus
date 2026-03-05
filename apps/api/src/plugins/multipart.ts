import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import fp from "fastify-plugin";

async function Multipart(fastify: FastifyInstance) {
  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5,
    },
  });
}

export const MultipartPlugin = fp(Multipart);
