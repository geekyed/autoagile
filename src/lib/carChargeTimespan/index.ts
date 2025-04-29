import { eq } from "drizzle-orm";
import { db } from "../db";
import { andersenChargeTimespanTable, andersenConfigTable } from "../db/schema";
import { getOrCreateCarConfig } from "../carConfig";
import { getPrices } from "../prices";
import { error } from "@sveltejs/kit";

export const getCarChargeTimespan = async (locals: App.Locals) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return null;
  }

  const carChargeTimespans = await db.query.andersenChargeTimespanTable
    .findMany({
      where: eq(andersenConfigTable.userId, user.id),
    });

  return carChargeTimespans;
};

export const createNewChargeTimespans = async (
  locals: App.Locals,
  toTime: string,
  percentCharge: number,
) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return null;
  }

  await db.delete(andersenChargeTimespanTable).where(
    eq(andersenChargeTimespanTable.userId, user.id),
  );

  const config = await getOrCreateCarConfig(locals);
  if (!config) {
    error(500, "Failed to get car charging configuration");
  }
  const prices = await getPrices(locals);

  const newTimespans = generateCarChargeTimespans(
    config,
    toTime,
    percentCharge,
    prices,
  );
  if (newTimespans.error) {
    error(500, newTimespans.error);
  }

  await db.insert(andersenChargeTimespanTable).values(
    newTimespans.chargeTimespans!.map((timespan) => ({
      userId: timespan.userId,
      startTime: timespan.startTime,
      endTime: timespan.endTime,
      averagePrice: timespan.averagePrice,
    })),
  );
};

const generateCarChargeTimespans = (
  chargeConfig: CarChargeConfig,
  toTime: string,
  percentCharge: number,
  prices: Price[],
): {
  error: string | undefined;
  chargeTimespans: AndersenChargeTimespan[] | undefined;
} => {
  const chargeTimespans: AndersenChargeTimespan[] = [];
  const endTime = calculateEndTime(toTime);
  const slots = calculateNoSlots(
    chargeConfig.batterySize,
    chargeConfig.chargeRate,
    percentCharge,
  );

  const availablePrices = filterPrices(prices, endTime).sort((a, b) =>
    a.price - b.price
  );

  if (slots > availablePrices.length) {
    return {
      error: "Not enough slots available",
      chargeTimespans: [{
        userId: chargeConfig.userId,
        startTime: prices.sort((a, b) =>
          a.start.getTime() - b.start.getTime()
        )[0].start,
        endTime: endTime,
        averagePrice: 0,
      }],
    };
  }
  const selectedPrices = availablePrices
    .slice(0, slots)
    .sort((a, b) => a.start!.getTime() - b.start!.getTime());

  let currentTimespan: AndersenChargeTimespan | undefined;
  let slotCount = 0;
  for (let i = 0; i < selectedPrices.length; i++) {
    const currentPrice = selectedPrices[i];
    const nextPrice = selectedPrices[i + 1];
    slotCount++;
    if (!currentTimespan) {
      currentTimespan = {
        userId: chargeConfig.userId,
        startTime: currentPrice.start,
        averagePrice: currentPrice.price,
        endTime: currentPrice.end,
      };
    } else {
      currentTimespan.averagePrice =
        (currentTimespan.averagePrice * (slotCount - 1) + currentPrice.price) /
        slotCount;
    }

    if (
      i === selectedPrices.length - 1 ||
      (nextPrice && !equalWithFuzziness(nextPrice.start, currentPrice.end, 1))
    ) {
      currentTimespan.endTime = currentPrice.end;
      currentTimespan.averagePrice =
        Math.round(currentTimespan.averagePrice * 10) / 10;
      chargeTimespans.push({ ...currentTimespan });
      currentTimespan = undefined;
      slotCount = 0;
    }
  }
  return { chargeTimespans, error: undefined };
};

const calculateEndTime = (toTime: string) => {
  const splitTime = toTime.split(":");
  const date = new Date();
  date.setHours(parseInt(splitTime[0]));
  date.setMinutes(parseInt(splitTime[1]));
  date.setSeconds(0);
  if (date.getTime() < Date.now()) date.setDate(date.getDate() + 1);
  return date;
};

const calculateNoSlots = (
  batterySize: number,
  chargeRate: number,
  percentCharge: number,
) => {
  const kwhRequired = (batterySize / 100) * percentCharge;
  const kwhPerSlot = chargeRate / 2;
  const slots = Math.ceil(kwhRequired / kwhPerSlot);
  return slots;
};

const filterPrices = (prices: Price[], endTime: Date) =>
  prices
    .filter((price) => price.start >= new Date())
    .filter((price) => price.end <= endTime)
    .reverse()
    .map((price) => ({
      start: price.start,
      end: price.end,
      price: price.price,
    })); // Deep copy

const equalWithFuzziness = (
  date1: Date | undefined,
  date2: Date | undefined,
  fuzzinessInMinutes: number,
) => {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;
  const timeDifference = Math.abs(date1.getTime() - date2.getTime());
  const fuzzinessInMilliseconds = fuzzinessInMinutes * 60 * 1000;

  return timeDifference <= fuzzinessInMilliseconds;
};
