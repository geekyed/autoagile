import { supabase } from "./supabaseAdmin.ts";

export const getUniqueTariffs = async (): Promise<Set<string>> => {
  console.info("Fetching unique tariffs from the database");

  const { data, error } = await supabase.from("profile").select(
    "octopus_tariff",
  );

  if (error) {
    console.error("Error fetching profiles from database:", error);
    return new Set<string>();
  }

  if (error || !data || data.length === 0) {
    console.info("No profiles found in the database.");
    return new Set<string>();
  }

  // Extract unique tariffs from the data
  const uniqueTariffs = new Set<string>();
  data.forEach((profile) => {
    if (profile.octopus_tariff) {
      uniqueTariffs.add(profile.octopus_tariff);
    }
  });

  return uniqueTariffs;
};
