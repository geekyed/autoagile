import { db } from "../db/index.ts";
import { profileTable } from "../db/schema.ts";

export const getUniqueTariffs = async (): Promise<string[]> => {
  console.info("Fetching unique tariffs from the database...");

  const tariffs = await db
    .selectDistinct({ tariff: profileTable.octopusTariff })
    .from(profileTable);

  if (!tariffs || tariffs.length === 0) {
    console.info("No tariffs found in the database.");
    return [];
  }
  console.info('tariffs', tariffs);
  return tariffs.map((t) => t.tariff);
}