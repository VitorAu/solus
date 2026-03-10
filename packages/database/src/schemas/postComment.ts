import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { postsTable } from "./post";
import { usersTable } from "./user";

export const postCommentsTable = pgTable(
  "postComments",
  {
    id: uuid().defaultRandom().primaryKey(),
    post_id: uuid()
      .notNull()
      .references(() => postsTable.id, {
        onDelete: "cascade",
      }),
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    parrent_comment_id: uuid(),
    comment: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  },
  (table) => [
    foreignKey({
      columns: [table.parrent_comment_id],
      foreignColumns: [table.id],
      name: "fk_post_comments_parent_id",
    }),
  ],
);
