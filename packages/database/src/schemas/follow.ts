import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const followsTable = pgTable(
  "follows",
  {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    following_id: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    follow_unique: unique("follow_unique").on(
      table.user_id,
      table.following_id,
    ),
  }),
);
