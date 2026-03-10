import { integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { postCommentsTable } from "./postComment";

export const postCommentAnalyticsTable = pgTable(
  "postCommentAnalytics",
  {
    id: uuid().defaultRandom().primaryKey(),
    comment_id: uuid().references(() => postCommentsTable.id, {
      onDelete: "cascade",
    }),
    likes: integer().notNull().default(0),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    post_comment_analytics_unique: unique("post_comment_analytics_unique").on(
      table.comment_id,
    ),
  }),
);
