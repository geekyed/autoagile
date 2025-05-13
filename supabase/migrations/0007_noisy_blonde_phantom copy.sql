CREATE TABLE "prices" (
	"tariff" text NOT NULL,
	"price" double precision NOT NULL,
	"start" timestamp (6) with time zone NOT NULL,
	"end" timestamp (6) with time zone NOT NULL,
	CONSTRAINT "prices_tariff_start_pk" PRIMARY KEY("tariff","start")
);