CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_groups" (
	"userId" uuid NOT NULL,
	"groupId" uuid NOT NULL,
	CONSTRAINT "user_groups_userId_groupId_pk" PRIMARY KEY("userId","groupId")
);
--> statement-breakpoint
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_userId_profile_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prices" ENABLE ROW LEVEL SECURITY;