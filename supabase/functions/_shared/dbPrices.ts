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

export const deletePrices = async (
  end: Date,
): Promise<void> => {
  console.log(`deleting price with end: ${end}`);

  const { error } = await supabase.from("prices").delete().lt(
    "end",
    end.toISOString(),
  );
  if (error) {
    console.error("Error deleting prices from database:", error);
  }
};
