import { pgTable, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const followCodeTable = pgTable("follow_code", {
  id: uuid().defaultRandom().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow().notNull(),
  expires_at: timestamp().notNull(),
});
