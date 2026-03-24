import { z } from "zod";

export const PostAnalyticSchema = z.object({
  id: z.uuid(),
  post_id: z.uuid(),
  like_count: z.number().nonnegative(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PostAnalyticType = z.infer<typeof PostAnalyticSchema>;
