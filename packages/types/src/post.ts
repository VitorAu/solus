import { z } from "zod";

export const PostSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  description: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
});

export type PostType = z.infer<typeof PostSchema>;
