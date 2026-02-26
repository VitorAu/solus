import { S3Client } from "@aws-sdk/client-s3";
import { environment } from "@/config/environment";

export const aws = new S3Client({
  region: environment.bucketRegion,
  credentials: {
    accessKeyId: environment.bucketAccessKey,
    secretAccessKey: environment.bucketSecretAccessKey,
  },
});
