CREATE TABLE "user_groups" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"group_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "user_groups" ENABLE ROW LEVEL SECURITY;

-- migrate all groups added in the profile group_id column to the new user_groups table
INSERT INTO "user_groups" ("user_id", "group_id")
SELECT "id", "groupId" FROM "profile" WHERE "groupId" IS NOT NULL;
