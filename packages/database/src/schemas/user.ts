import { pgTable, uuid, varchar, timestamp, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 40 }).notNull().unique(),
  avatar_key: varchar({ length: 2048 }),
  password: varchar({ length: 255 }).notNull(),
  birth_date: date({ mode: "date" }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});
