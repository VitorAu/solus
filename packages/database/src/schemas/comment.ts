import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { postTable } from "./post";
import { userTable } from "./user";

export const commentTable = pgTable(
  "comment",
  {
    id: uuid().defaultRandom().primaryKey(),
    post_id: uuid()
      .notNull()
      .references(() => postTable.id, {
        onDelete: "cascade",
      }),
    user_id: uuid()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    parent_comment_id: uuid(),
    comment: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  },
  (table) => [
    foreignKey({
      columns: [table.parent_comment_id],
      foreignColumns: [table.id],
    }),
  ],
);
