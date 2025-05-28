ALTER TABLE "andersen_charge_timespan_table" DROP CONSTRAINT "andersen_charge_timespan_table_group_id_start_time_pk";--> statement-breakpoint
ALTER TABLE "andersen_charge_timespan_table" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "andersen_charge_timespan_table" ADD CONSTRAINT "unique group start" UNIQUE("group_id","start_time");--> statement-breakpoint
ALTER TABLE "andersen_charge_timespan_table" ADD CONSTRAINT "unique group end" UNIQUE("group_id","end_time");