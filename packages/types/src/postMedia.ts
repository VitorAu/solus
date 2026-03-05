import { z } from "zod";

const PostMediaSchema = z.object({
  id: z.string(),
  order: z.number().nonnegative(),
  media_type: z.enum(["image", "video"]),
  post_id: z.uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export { PostMediaSchema };
export type PostMediaType = z.infer<typeof PostMediaSchema>;
