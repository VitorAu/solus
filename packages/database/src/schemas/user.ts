import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const userTable = pgTable("user", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 40 }).notNull().unique(),
  avatar_key: varchar({ length: 2048 }),
  birth_date: date({ mode: "date" }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  role: roleEnum().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});
