import {
  type ColumnBaseConfig,
  type ColumnDataType,
  relations,
} from "drizzle-orm";
import {
  doublePrecision,
  PgColumn,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const groupTable = pgTable("group", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").notNull().unique(),
  octopusTariff: text("octopus_tariff"),
});

export const profileTable = pgTable("profile", {
  id: uuid("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  groupId: uuid("groupId").references((): PgColumn<
    ColumnBaseConfig<ColumnDataType, string>
  > => groupTable.id),
});

export const profileRelations = relations(profileTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [profileTable.groupId],
    references: [groupTable.id],
  }),
}));

export const andersenConfigTable = pgTable("andersen_config", {
  groupId: uuid("group_id").references((): PgColumn<
    ColumnBaseConfig<ColumnDataType, string>
  > => groupTable.id).primaryKey(),
  andersenUsername: text("andersen_username").notNull(),
  andersenPassword: text("andersen_password").notNull(),
  batterySize: doublePrecision("battery_size").notNull(),
  chargeRate: doublePrecision("charge_rate").notNull(),
});

export const pricesTable = pgTable("prices", {
  tariff: text("tariff").notNull(),
  price: doublePrecision("price").notNull(),
  start: timestamp("start", { precision: 6, withTimezone: true }).notNull(),
  end: timestamp("end", { precision: 6, withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.tariff, table.start] }),
]);

export const andersenChargeTimespanTable = pgTable(
  "andersen_charge_timespan_table",
  {
    groupId: uuid("group_id").notNull(),
    startTime: timestamp("start_time", { precision: 6, withTimezone: true })
      .notNull(),
    endTime: timestamp("end_time", { precision: 6, withTimezone: true })
      .notNull(),
    averagePrice: doublePrecision("average_price").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.groupId, table.startTime] }),
  ],
);

// export const tapoConfigTable = pgTable("tapo_config_table", {
//   userId: uuid("user_id").primaryKey().references(() => profileTable.id)
//     .notNull(),
//   tapoUsername: text("tapo_username").notNull(),
//   tapoPassword: text("tapo_password").notNull(),
//   tapoClientUuid: text("tapo_client_uuid").notNull(),
// });

// // we write to this table when we get the device list from tapo.
// export const tapoDeviceTable = pgTable("tapo_device_table", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   alias: text("alias").notNull(),
//   userId: uuid("user_id").references(() => tapoConfigTable.userId).notNull(),
// });

// export const smartDeviceScheduleTable = pgTable("smart_device_schedule_table", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   deviceType: text("device_type").notNull(),
//   deviceId: uuid("device_id").notNull(),
//   executionTime: timestamp("execution_time", {
//     precision: 6,
//     withTimezone: true,
//   }),
//   toState: text("to_state").notNull(),
// });
