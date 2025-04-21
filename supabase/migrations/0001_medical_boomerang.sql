CREATE TABLE "prices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tariff" text NOT NULL,
	"price" numeric NOT NULL,
	"created" timestamp (6) with time zone,
	"start" timestamp (6) with time zone,
	"end" timestamp (6) with time zone
);

ALTER TABLE "prices" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "octopus_account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "octopus_account_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "octopus_tariff" text;