import { Database } from "../../../../../database.types.ts";
import { supabase } from "../index.ts";

export const getPrices = async (tariffCode: string): Promise<Price[]> => {
  const { data: dbPrices, error } = await supabase.from("prices").select().eq(
    "tariff",
    tariffCode,
  );
  if (error) {
    console.error("Error fetching prices from database:", error);
    return [];
  }
  const prices = dbPrices.map((dbPrice): Price => ({
    tariff: dbPrice.tariff,
    price: dbPrice.price,
    start: new Date(dbPrice.start),
    end: new Date(dbPrice.end),
  }));
  return prices;
};

export const insertPrices = async (prices: Price[]): Promise<void> => {
  const pricesToInsert: Database["public"]["Tables"]["prices"]["Insert"][] =
    prices.map((p) => {
      return {
        tariff: p.tariff,
        price: p.price,
        start: p.start.toISOString(),
        end: p.end.toISOString(),
      };
    });
  const { error } = await supabase.from("prices").insert(pricesToInsert);
  if (error) {
    console.error("Error inserting prices into database:", error);
  }
};

export const deletePrices = async (tariffCode: string): Promise<void> => {
  const { error } = await supabase.from("prices").delete().eq(
    "tariff",
    tariffCode,
  );
  if (error) {
    console.error("Error deleting prices from database:", error);
  }
};
