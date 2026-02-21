import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const followsTable = pgTable(
  "follows",
  {
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id),
    following_id: uuid()
      .notNull()
      .references(() => usersTable.id),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.user_id, table.following_id],
    }),
  ],
);
