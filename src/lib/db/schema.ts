import {
  doublePrecision,
  pgTable,
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

export const andersenConfigTable = pgTable("andersen_config_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profileTable.id).notNull(),
  andersenUsername: text("andersen_username").notNull(),
  andersenPassword: text("andersen_password").notNull(),
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

export const tapoConfigTable = pgTable("tapo_config_table", {
  userId: uuid("user_id").primaryKey().references(() => profileTable.id)
    .notNull(),
  tapoUsername: text("tapo_username").notNull(),
  tapoPassword: text("tapo_password").notNull(),
  tapoClientUuid: text("tapo_client_uuid").notNull(),
});

// we write to this table when we get the device list from tapo.
export const tapoDeviceTable = pgTable("tapo_device_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  alias: text("alias").notNull(),
  userId: uuid("user_id").references(() => tapoConfigTable.userId).notNull(),
});

export const smartDeviceScheduleTable = pgTable("smart_device_schedule_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceType: text("device_type").notNull(),
  deviceId: uuid("device_id").notNull(),
  executionTime: timestamp("execution_time", {
    precision: 6,
    withTimezone: true,
  }),
  toState: text("to_state").notNull(),
});
