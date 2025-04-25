import {
  doublePrecision,
  pgTable,
  pgView,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const profileTable = pgTable("profile", {
  id: uuid("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  octopusAccountId: text("octopus_account_id").notNull(),
  octopusAPIKey: text("octopus_account_key").notNull(),
  octopusTariff: text("octopus_tariff"),
});

export const pricesTable = pgTable("prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tariff: text("tariff").notNull(),
  price: doublePrecision("price").notNull(),
  start: timestamp("start", { precision: 6, withTimezone: true }).notNull(),
  end: timestamp("end", { precision: 6, withTimezone: true }).notNull(),
});

export const tariffsView = pgView("tariffs", {
  octopusTariff: text("octopus_tariff").references(() =>
    profileTable.octopusTariff
  ).unique(),
});

export const andersenConfigTable = pgTable("andersen_config_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profileTable.id),
  andersenUsername: text("andersen_username"),
  andersenPassword: text("andersen_password"),
  batterySize: doublePrecision("battery_size").notNull(),
  chargeRate: doublePrecision("charge_rate").notNull(),
});

export const andersenChargeTimespanTable = pgTable(
  "andersen_charge_timespan_table",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => profileTable.id).notNull(),
    startTime: timestamp("start_time", { precision: 6, withTimezone: true })
      .notNull(),
    endTime: timestamp("end_time", { precision: 6, withTimezone: true })
      .notNull(),
    averagePrice: doublePrecision("average_price").notNull(),
  },
);
