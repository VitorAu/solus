import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { postTable } from "./post";

export const mediaTypeEnum = pgEnum("media", ["IMAGE", "VIDEO"]);

export const postMediaTable = pgTable("post_media", {
  id: text().notNull().primaryKey(),
  post_id: uuid()
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  order: integer().notNull(),
  media: mediaTypeEnum().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
