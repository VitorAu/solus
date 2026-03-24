import { z } from "zod";

export const PostMediaSchema = z.object({
  id: z.string(),
  post_id: z.uuid(),
  order: z.number().nonnegative(),
  media: z.enum(["IMAGE", "VIDEO"]),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PostMediaType = z.infer<typeof PostMediaSchema>;
