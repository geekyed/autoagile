ALTER TABLE "andersen_config" ADD PRIMARY KEY ("group_id");--> statement-breakpoint
ALTER TABLE "andersen_config" ALTER COLUMN "group_id" SET NOT NULL;