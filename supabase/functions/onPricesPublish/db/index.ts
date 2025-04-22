import postgres from "npm:postgres";
import { drizzle } from "npm:drizzle-orm/postgres-js";
import * as schema from './schema.ts'

const connectionString = Deno.env.get("SUPABASE_DB_URL");

const client = postgres(connectionString, { prepare: false});
export const db = drizzle(client, { schema });