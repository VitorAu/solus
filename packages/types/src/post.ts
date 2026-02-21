import { z } from "zod";

const PostSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  like_count: z.number().int(),
  description: z.string(),
  media: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
});

export { PostSchema };
export type PostType = z.infer<typeof PostSchema>;
