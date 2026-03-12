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
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { FollowRoutes } from "./routes/follow";
import { AnalyticRoutes } from "./routes/analytic";

export function CreateServer(database: NodePgDatabase<any>) {
  const isDev = environment.nodeEnv === "development";

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
  server.register(AuthRoutes, { prefix: "/api/v1/auth", database: database });
  server.register(AnalyticRoutes, {
    prefix: "/api/v1/analytics",
    database: database,
  });
  server.register(UserRoutes, { prefix: "/api/v1/user", database: database });
  server.register(FollowRoutes, {
    prefix: "/api/v1/follow",
    database: database,
  });

  return server;
}
