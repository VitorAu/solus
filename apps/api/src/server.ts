import { JwtPlugin } from "@/plugins/jwt";
import { SwaggerPlugin } from "@/plugins/swagger";
import { SwaggerUiPlugin } from "@/plugins/swagger-ui";
import { environment } from "@config/environment";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { CorsPlugin } from "./plugins/cors";
import { HealthRoutes } from "./routes/health";
import { AuthRoutes } from "./routes/auth";

const isDev = environment.nodeEnvironment === "development";

const Logger = {
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
  logger: isDev ? Logger.development : Logger.production,
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(SwaggerPlugin);
server.register(SwaggerUiPlugin);
server.register(JwtPlugin);
server.register(CorsPlugin);

server.register(HealthRoutes, { prefix: "/api/v1/health" });
server.register(AuthRoutes, { prefix: "/api/v1/auth" });

server.listen({ port: environment.serverPort, host: "0.0.0.0" }, (error) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  }
  server.log.info(
    `🚀 HTTP server running on http://0.0.0.0:${environment.serverPort}`,
  );
  server.log.info(
    `📚 API documentation available at http://0.0.0.0:${environment.serverPort}/documentation`,
  );
});

export { server };
