import { integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { commentTable } from "./comment";

export const commentAnalyticTable = pgTable(
  "comment_analytic",
  {
    id: uuid().defaultRandom().primaryKey(),
    comment_id: uuid().references(() => commentTable.id, {
      onDelete: "cascade",
    }),
    like_count: integer().notNull().default(0),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => [unique().on(table.comment_id)],
);
