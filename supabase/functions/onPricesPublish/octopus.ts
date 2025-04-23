import {
  deletePrices,
  getPrices as getDbPrices,
  insertPrices,
} from "./db/prices/index.ts";

const newPricesRequired = (prices: Price[]): boolean => {
  if (prices.length === 0) return true;
  return new Date().getTime() - prices[0].start.getTime() >
    24 * 60 * 60 * 1000; // Over 24 hours old
};

export const getPrices = async (tariffCode: string): Promise<Price[]> => {
  const dbPrices = await getDbPrices(tariffCode);

  if (!newPricesRequired(dbPrices)) {
    console.info(`returning existing prices for ${tariffCode}`);
    return dbPrices;
  }
  console.info(`getting new prices for ${tariffCode}`);
  const prices = await getNewPrices(tariffCode);
  if (prices.length > 0) {
    await deletePrices(tariffCode);
    await insertPrices(prices);
  }
  return prices;
};

const getNewPrices = async (tariffCode: string): Promise<Price[]> => {
  try {
    const productCode = tariffCode.split("-").slice(2, 6).join("-");
    console.info(`getting new prices for product code: ${productCode}`);
    const url =
      `https://api.octopus.energy/v1/products/${productCode}/electricity-tariffs/${tariffCode}/standard-unit-rates/`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rates = await response.json();
    if (rates.results.length < 1) return [];

    return rates.results.map((rate: StandardUnitRate): Price => ({
      start: new Date(rate.valid_from),
      end: new Date(rate.valid_to),
      price: rate.value_inc_vat,
      tariff: tariffCode,
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching account data:", error.message);
    } else {
      console.error("Error fetching account data:", error);
    }
    return Promise.reject(new Error("error fetching rates"));
  }
};

export const getTariffCode = async (
  accountId: string,
  apiKey: string,
): Promise<string> => {
  const account = await fetchAccountData(accountId, apiKey);

  if (!account) throw new Error("no account found");
  const electricityMeterPoints: MeterPoint[] = account.properties.flatMap(
    (property) =>
      property.electricity_meter_points.flatMap((meterPoint) =>
        meterPoint.agreements
      ),
  );

  const currentTariff = electricityMeterPoints.find((meterPoint) => {
    const now = new Date();
    const validFrom = new Date(meterPoint.valid_from);
    const validTo = meterPoint.valid_to ? new Date(meterPoint.valid_to) : null;

    return validFrom <= now && (!validTo || now < validTo) &&
      meterPoint.tariff_code.includes("E-1R-AGILE");
  });

  if (currentTariff) return currentTariff.tariff_code;
  throw new Error("failed to get tariff code");
};

const fetchAccountData = async (
  accountId: string,
  apiKey: string,
): Promise<AccountData | null> => {
  const url = `https://api.octopus.energy/v1/accounts/${accountId}/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${apiKey}:`)}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching account data:", error.message);
    } else {
      console.error("Error fetching account data:", error);
    }
    return null;
  }
};
