CREATE TABLE "andersen_charge_timespan_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"start_time" timestamp (6) with time zone NOT NULL,
	"end_time" timestamp (6) with time zone NOT NULL,
	"average_price" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "andersen_config_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"andersen_username" text,
	"andersen_password" text,
	"battery_size" double precision NOT NULL,
	"charge_rate" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prices" ALTER COLUMN "price" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "andersen_charge_timespan_table" ADD CONSTRAINT "andersen_charge_timespan_table_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "andersen_config_table" ADD CONSTRAINT "andersen_config_table_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prices" DROP COLUMN "created";