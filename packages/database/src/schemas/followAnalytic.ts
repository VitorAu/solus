import { pgTable, uuid, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const followAnalyticTable = pgTable(
  "follow_analytic",
  {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    follows_count: integer().notNull().default(0),
    followers_count: integer().notNull().default(0),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => [unique().on(table.user_id)],
);
