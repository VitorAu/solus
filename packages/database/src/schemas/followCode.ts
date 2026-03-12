import { pgTable, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const followCodesTable = pgTable("followCodes", {
  id: uuid().defaultRandom().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow().notNull(),
  expires_at: timestamp().notNull(),
});
