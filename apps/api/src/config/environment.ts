export const environment = {
  nodeEnvironment: process.env.NODE_ENVIRONMENT ?? "development",
  serverPort: Number(process.env.SERVER_PORT) ?? 8080,
  databaseURL: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "secret",
};
