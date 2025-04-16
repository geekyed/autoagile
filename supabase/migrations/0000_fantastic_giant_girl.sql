CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL
);

ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;