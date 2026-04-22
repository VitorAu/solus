import { integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { postTable } from "./post";

export const postAnalyticTable = pgTable(
  "post_analytic",
  {
    id: uuid().defaultRandom().primaryKey(),
    post_id: uuid()
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),
    like_count: integer().notNull().default(0),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => [unique().on(table.post_id)],
);
