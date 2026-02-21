import { z } from "zod";

export const FollowCodeSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  created_at: z.date(),
  expired_at: z.date(),
});

export type FollowCodeType = z.infer<typeof FollowCodeSchema>;
