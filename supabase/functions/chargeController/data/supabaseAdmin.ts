import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types.d.ts";

export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
