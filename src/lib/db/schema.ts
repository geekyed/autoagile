import {
  numeric,
  pgTable,
  pgView,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const profileTable = pgTable("profile", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  octopusAccountId: text("octopus_account_id").notNull(),
  octopusAPIKey: text("octopus_account_key").notNull(),
  octopusTariff: text("octopus_tariff"),
});

export const pricesTable = pgTable("prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tariff: text("tariff").notNull(),
  price: numeric("price").notNull(),
  start: timestamp("start", { precision: 6, withTimezone: true }).notNull(),
  end: timestamp("end", { precision: 6, withTimezone: true }).notNull(),
});

export const tariffs = pgView("tariffs", {
  octopusTariff: text("octopus_tariff"),
});
