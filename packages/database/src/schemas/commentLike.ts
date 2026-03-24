import { boolean, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { commentTable } from "./comment";
import { userTable } from "./user";

export const commentLikeTable = pgTable(
  "comment_like",
  {
    id: uuid().defaultRandom().primaryKey(),
    comment_id: uuid()
      .notNull()
      .references(() => commentTable.id, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    liked: boolean().notNull().default(true),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => [unique().on(table.user_id, table.comment_id)],
);
