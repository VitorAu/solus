import "dotenv/config";

import { environment } from "@/config/environment";
import { CorsPlugin } from "@/plugins/cors";
import { JwtPlugin } from "@/plugins/jwt";
import { MultipartPlugin } from "@/plugins/multipart";
import { SwaggerPlugin } from "@/plugins/swagger";
import { SwaggerUiPlugin } from "@/plugins/swagger-ui";
import { AuthRoutes } from "@/routes/auth";
import { HealthRoutes } from "@/routes/health";
import { MediaRoutes } from "@/routes/media";
import { UserRoutes } from "@/routes/user";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export function CreateServer() {
  const isDev = environment.nodeEnvironment === "development";

  const logger = {
    development: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    },
    production: false,
  };

  const server = fastify({
    logger: isDev ? logger.development : logger.production,
  });

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.register(SwaggerPlugin);
  server.register(SwaggerUiPlugin);
  server.register(JwtPlugin);
  server.register(CorsPlugin);
  server.register(MultipartPlugin);

  server.register(HealthRoutes, { prefix: "/api/v1/health" });
  server.register(MediaRoutes, { prefix: "/api/v1/media" });
  server.register(AuthRoutes, { prefix: "/api/v1/auth" });
  server.register(UserRoutes, { prefix: "/api/v1/user" });

  return server;
}
