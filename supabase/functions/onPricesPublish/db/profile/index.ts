import { supabase } from "../index.ts";

export const getUniqueTariffs = async (): Promise<string[]> => {
  console.info("Fetching unique tariffs from the database...");

  const { data: profiles, error } = await supabase
    .from("tariffs")
    .select();

  if (error || !profiles || profiles.length === 0) {
    console.info("No tariffs found in the database.");
    return [];
  }

  return profiles.map((profile) => {
    if (!profile.octopus_tariff) throw Error("Tariff is undefined");
    return profile.octopus_tariff;
  });
};
