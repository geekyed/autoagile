import { eq } from "drizzle-orm";
import { pricesTable } from "../../db/schema";
import { db } from "../../db";

export const get = async (tariff: string): Promise<Price[]> => {
  return (await db.query.pricesTable.findMany({
    where: eq(pricesTable.tariff, tariff),
    orderBy: (pricesTable, { desc }) => [
      desc(pricesTable.start),
    ],
  }));
};

export const insertPrices = async (prices: Price[]): Promise<void> => {
  const filteredPrices = prices.filter((price) =>
    price.end.getTime() > new Date().getTime()
  );

  if (filteredPrices.length === 0) return;

  const pricesToInsert = filteredPrices.map((p) => {
    return {
      tariff: p.tariff,
      price: p.price,
      start: new Date(p.start.toISOString()),
      end: new Date(p.end.toISOString()),
    };
  });
  console.log("Prices to insert:", pricesToInsert);

  await db.insert(pricesTable).values(pricesToInsert).onConflictDoUpdate(
    {
      target: [pricesTable.tariff, pricesTable.start],
      set: pricesTable,
    },
  );
};
