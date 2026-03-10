import { pgTable, uuid, timestamp, boolean, unique } from "drizzle-orm/pg-core";
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
    is_following: boolean().notNull().default(true),
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
