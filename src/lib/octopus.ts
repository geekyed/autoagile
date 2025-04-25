// import { eq } from 'drizzle-orm'
// import { db } from './db'
// import { pricesTable } from './db/schema'

interface MeterPoint {
  tariff_code: string;
  valid_from: string;
  valid_to: string | null;
}

interface ElectricityMeterPoint {
  mpan: string;
  agreements: MeterPoint[];
}

interface Property {
  electricity_meter_points: ElectricityMeterPoint[];
}

interface AccountData {
  properties: Property[];
}

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
