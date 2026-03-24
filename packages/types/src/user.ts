import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  username: z.string(),
  avatar_key: z.string().optional().nullable(),
  birth_date: z.coerce.date(),
  password: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
});

export type UserType = z.infer<typeof UserSchema>;
