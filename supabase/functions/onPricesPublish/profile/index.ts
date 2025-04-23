import { supabase } from "../supabase/index.ts";

export const getUniqueTariffs = async (): Promise<string[]> => {
  console.info("Fetching unique tariffs from the database...");

  const { data: tariffs, error} = await supabase.from("profile").select("octopus_tariff", {distinct: true})

  if (error || !tariffs || tariffs.length === 0) {
    console.info("No tariffs found in the database.");
    return [];
  }
  console.info('tariffs', tariffs);
  return tariffs.map((t) => t.octopus_tariff);
}