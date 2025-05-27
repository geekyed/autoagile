import { eq } from "drizzle-orm";
import { pricesTable } from "../../db/schema";
import { db } from "../../db";

const getPrices = async (tariff: string): Promise<Price[]> => {
  return await db.query.pricesTable.findMany({
    where: eq(pricesTable.tariff, tariff),
  });
};

export const get = async (tariff: string): Promise<Price[]> => {
  return (await getPrices(tariff)).sort((a, b) =>
    a.start.getTime() - b.start.getTime()
  );
};
