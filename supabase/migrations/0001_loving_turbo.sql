ALTER TABLE "group" DROP CONSTRAINT "group_owner_id_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "owner_id" SET NOT NULL;