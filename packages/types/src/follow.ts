import { z } from "zod";

export const FollowSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  following_id: z.uuid(),
  is_following: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type FollowType = z.infer<typeof FollowSchema>;
