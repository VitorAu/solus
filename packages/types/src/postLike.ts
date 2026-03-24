import { z } from "zod";

export const PostLikeSchema = z.object({
  id: z.uuid(),
  post_id: z.uuid(),
  user_id: z.uuid(),
  is_liked: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PostLikeType = z.infer<typeof PostLikeSchema>;
