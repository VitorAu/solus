import { boolean, pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { postsTable } from "./post";
import { usersTable } from "./user";

export const postLikesTable = pgTable(
  "postLikes",
  {
    id: uuid().defaultRandom().primaryKey(),
    post_id: uuid()
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    liked: boolean().notNull().default(true),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    post_like_user_unique: unique("post_like_user_unique").on(
      table.post_id,
      table.user_id,
    ),
  }),
);
