import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const followCodesTable = pgTable("followCodes", {
  id: text().notNull().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id),
  created_at: timestamp().defaultNow().notNull(),
  expires_at: timestamp().notNull(),
});
