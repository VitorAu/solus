import { pgTable, uuid, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const followAnalyticsTable = pgTable(
  "followAnalytics",
  {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    following: integer().notNull().default(0),
    followers: integer().notNull().default(0),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    follow_analytics_unique: unique("follow_analytics_unique").on(
      table.user_id,
    ),
  }),
);
