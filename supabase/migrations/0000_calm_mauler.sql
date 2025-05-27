CREATE TABLE "andersen_charge_timespan_table" (
	"id" uuid NOT NULL,
	"start_time" timestamp (6) with time zone NOT NULL,
	"end_time" timestamp (6) with time zone NOT NULL,
	"average_price" double precision NOT NULL,
	CONSTRAINT "andersen_charge_timespan_table_id_start_time_pk" PRIMARY KEY("id","start_time")
);
--> statement-breakpoint
CREATE TABLE "andersen_config" (
	"group_id" uuid,
	"andersen_username" text NOT NULL,
	"andersen_password" text NOT NULL,
	"battery_size" double precision NOT NULL,
	"charge_rate" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"owner_id" uuid,
	"octopus_tariff" text
);
--> statement-breakpoint
CREATE TABLE "prices" (
	"tariff" text NOT NULL,
	"price" double precision NOT NULL,
	"start" timestamp (6) with time zone NOT NULL,
	"end" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "prices_tariff_start_pk" PRIMARY KEY("tariff","start")
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"groupId" uuid
);
--> statement-breakpoint
ALTER TABLE "andersen_config" ADD CONSTRAINT "andersen_config_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_owner_id_profile_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "group" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "andersen_charge_timespan_table" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "andersen_config" ENABLE ROW LEVEL SECURITY;
