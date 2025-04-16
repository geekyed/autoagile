import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const profileTable = pgTable("profile", {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
})