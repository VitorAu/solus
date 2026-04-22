import { z } from "zod";

export const PostMediaSchema = z.object({
  id: z.uuid(),
  post_id: z.uuid(),
  order: z.number().nonnegative(),
  media: z.enum(["IMAGE", "VIDEO"]),
  storage_key: z.string(),
  url: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
});

export type PostMediaType = z.infer<typeof PostMediaSchema>;
