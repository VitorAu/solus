import { z } from "zod";

export const FollowAnalyticSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  follows_count: z.number().int().nonnegative(),
  followers_count: z.number().int().nonnegative(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type FollowAnalyticType = z.infer<typeof FollowAnalyticSchema>;
