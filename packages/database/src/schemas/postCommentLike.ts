import { boolean, pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { postsTable } from "./post";
import { usersTable } from "./user";
import { postCommentsTable } from "./postComment";

export const postCommentLikesTable = pgTable(
  "postCommentLikes",
  {
    id: uuid().defaultRandom().primaryKey(),
    comment_id: uuid()
      .notNull()
      .references(() => postCommentsTable.id, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    liked: boolean().notNull().default(true),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    post_comment_like_user_unique: unique("post_comment_like_user_unique").on(
      table.user_id,
      table.comment_id,
    ),
  }),
);
