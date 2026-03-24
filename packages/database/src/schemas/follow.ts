import { pgTable, uuid, timestamp, boolean, unique } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const followTable = pgTable(
  "follow",
  {
    id: uuid().defaultRandom().primaryKey(),
    user_id: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    follows_user_id: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    is_following: boolean().notNull().default(true),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => [unique().on(table.user_id, table.follows_user_id)],
);
