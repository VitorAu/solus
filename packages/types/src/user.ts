import { z } from "zod";

const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  username: z.string(),
  avatar_url: z.string().optional().nullable(),
  password: z.string(),
  birthdate: z.coerce.date(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
});

export { UserSchema };
export type UserType = z.infer<typeof UserSchema>;
