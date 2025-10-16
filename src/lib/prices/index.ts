import * as dbPrices from "../data/prices";
import * as octopus from "../thirdPartyAPIs/octopus";

const numPricesAfter4pm = 14;

export const getPrices = async (tariff: string): Promise<Price[]> => {
  const storedPrices = await dbPrices.get(tariff);

  console.log(
    `found ${storedPrices.length} prices in db for tariff: ${tariff}`,
  );
  if (storedPrices.length > numPricesAfter4pm) return storedPrices;

  const prices = (await octopus.getPrices(tariff)).filter(price => price.end > new Date());
  if (prices.length > 0) await dbPrices.insertPrices(prices);
  return prices;
};
