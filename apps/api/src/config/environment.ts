import "dotenv/config";

export const environment = {
  nodeEnvironment: process.env.NODE_ENVIRONMENT ?? "development",
  serverPort: Number(process.env.SERVER_PORT) ?? 8080,
  databaseURL: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "secret",
  bucketName: process.env.BUCKET_NAME ?? "",
  bucketRegion: process.env.BUCKET_REGION ?? "",
  bucketAccessKey: process.env.BUCKET_ACCESS_KEY ?? "",
  bucketSecretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY ?? "",
};
