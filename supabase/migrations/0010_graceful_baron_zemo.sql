ALTER TABLE "invite" DROP CONSTRAINT "invite_pkey";--> statement-breakpoint
ALTER TABLE "invite" ADD PRIMARY KEY ("email");--> statement-breakpoint
ALTER TABLE "invite" ALTER COLUMN "token" DROP NOT NULL;