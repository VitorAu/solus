import { integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { postsTable } from "./post";

export const postAnalyticsTable = pgTable(
  "postAnalytics",
  {
    id: uuid().defaultRandom().primaryKey(),
    post_id: uuid().references(() => postsTable.id, { onDelete: "cascade" }),
    likes: integer().notNull().default(0),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    post_analytics_unique: unique("post_analytics_unique").on(table.post_id),
  }),
);
