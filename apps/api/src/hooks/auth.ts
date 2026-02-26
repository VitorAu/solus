import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";

export async function Auth(req: FastifyRequest, res: FastifyReply) {
  await req.jwtVerify();
  const user = req.user as any;

  if (user.type !== "access") {
    return res.code(400).send({
      status: "error",
      message: "Unauthorized",
      error: "Invalid token type",
    });
  }
}
