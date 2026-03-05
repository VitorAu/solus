import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const postsTable = pgTable("posts", {
  id: uuid().defaultRandom().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  like_count: integer().notNull().default(0),
  description: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});
