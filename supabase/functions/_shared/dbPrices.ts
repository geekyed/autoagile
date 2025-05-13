import { Database } from "../../../database.types.ts";
import { supabase } from "./supabaseAdmin.ts";

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
  const filteredPrices = prices.filter((price) =>
    price.end.getTime() > new Date().getTime()
  );
  const pricesToInsert: Database["public"]["Tables"]["prices"]["Insert"][] =
    filteredPrices.map((p) => {
      return {
        tariff: p.tariff,
        price: p.price,
        start: p.start.toISOString(),
        end: p.end.toISOString(),
      };
    });
  console.log("Prices to insert:", pricesToInsert);

  const { error } = await supabase
    .from("prices")
    .upsert(pricesToInsert, {
      onConflict: "tariff,start",
      ignoreDuplicates: true,
    });

  if (error) {
    console.error("Error inserting prices into database:", error);
  }
};

// floors minutes to the nearest half an hour
const getMinutes = (minutes: number): number => {
  return Math.floor(minutes / 30) * 30;
};

export const deletePrices = async (
  end: Date,
): Promise<void> => {
  const flooredEnd = new Date(end);
  flooredEnd.setSeconds(0, 0);
  flooredEnd.setMinutes(getMinutes(end.getMinutes()));

  console.log(`deleting price with end: ${flooredEnd}`);

  const { error } = await supabase.from("prices").delete().eq(
    "end",
    flooredEnd.toISOString(),
  );
  if (error) {
    console.error("Error deleting prices from database:", error);
  }
};
