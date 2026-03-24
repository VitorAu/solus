import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const postTable = pgTable("post", {
  id: uuid().defaultRandom().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  description: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});
