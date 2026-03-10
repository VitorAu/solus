import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { postsTable } from "./post";

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);

export const postMediasTable = pgTable("postMedias", {
  id: text().notNull().primaryKey(),
  order: integer().notNull(),
  media_type: mediaTypeEnum().notNull(),
  post_id: uuid()
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
