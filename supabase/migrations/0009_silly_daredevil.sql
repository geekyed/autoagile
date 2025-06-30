CREATE TABLE "invite" (
	"token" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invite" ADD CONSTRAINT "invite_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "invite" ENABLE ROW LEVEL SECURITY;