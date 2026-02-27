import { environment } from "@/config/environment";
import { CreateServer } from "@/server";

const server = CreateServer();

async function Main() {
  try {
    await server.listen({ port: environment.serverPort, host: "0.0.0.0" });

    server.log.info(
      `🚀 HTTP server running on http://0.0.0.0:${environment.serverPort}`,
    );
    server.log.info(
      `📚 API documentation available at  http://0.0.0.0:${environment.serverPort}/documentation`,
    );
  } catch (error) {
    server.log.error(error, "💥 Failed to start HTTP server");
    process.exit(1);
  }
}

Main();
