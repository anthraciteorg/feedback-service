CREATE TABLE IF NOT EXISTS "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" char(64) NOT NULL,
	"message_id" char(64) NOT NULL,
	"network_id" char(64) NOT NULL,
	"prompt" text NOT NULL,
	"completion" text NOT NULL,
	"model" text NOT NULL,
	"label" boolean NOT NULL,
	"explanation" text,
	"created_at" timestamp DEFAULT timezone('UTC', now()) NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_id_message_id_idx" UNIQUE("user_id","message_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback_tags" (
	"feedback_id" serial NOT NULL,
	"tag_id" serial NOT NULL,
	CONSTRAINT "feedback_tags_feedback_id_tag_id_pk" PRIMARY KEY("feedback_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback_tags" ADD CONSTRAINT "feedback_tags_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback_tags" ADD CONSTRAINT "feedback_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "network_id_created_at_idx" ON "feedback" USING btree ("network_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "tags" USING btree ("name");