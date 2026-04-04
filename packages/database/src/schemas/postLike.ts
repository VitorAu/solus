import { boolean, pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { postTable } from "./post";
import { userTable } from "./user";

export const postLikeTable = pgTable(
  "post_like",
  {
    id: uuid().defaultRandom().primaryKey(),
    post_id: uuid()
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    is_liked: boolean().notNull().default(true),
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
