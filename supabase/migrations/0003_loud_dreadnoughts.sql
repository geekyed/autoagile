ALTER TABLE "andersen_charge_timespan_table" RENAME COLUMN "id" TO "group_id";--> statement-breakpoint
ALTER TABLE "andersen_charge_timespan_table" DROP CONSTRAINT "andersen_charge_timespan_table_id_start_time_pk";--> statement-breakpoint
ALTER TABLE "andersen_charge_timespan_table" ADD CONSTRAINT "andersen_charge_timespan_table_group_id_start_time_pk" PRIMARY KEY("group_id","start_time");