import { z } from "zod";

export const FollowSchema = z.object({
  user_id: z.uuid(),
  following_id: z.uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type FollowType = z.infer<typeof FollowSchema>;
