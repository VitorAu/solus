import { z } from "zod";

export const FollowAnalyticsSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  following: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type FollowAnalyticsType = z.infer<typeof FollowAnalyticsSchema>;
