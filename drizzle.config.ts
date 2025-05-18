import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./supabase/migrations",
  dbCredentials: {
    host: "127.0.0.1",
    port: 54321,
    user: "postgres",
    password: "postgres",
    database: "supabase",
  },
});
