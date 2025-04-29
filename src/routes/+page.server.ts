import { getCarChargeTimespan } from "../lib/carChargeTimespan";
import { getPrices } from "../lib/prices";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  const prices: Price[] = [];
  const carChargeTimespans: AndersenChargeTimespan[] = [];

  console.log("-------------------", carChargeTimespans);

  function floorToNearest30Minutes(date: Date): Date {
    const floored = new Date(date);
    const minutes = floored.getMinutes();
    const flooredMinutes = minutes < 30 ? 0 : 30;
    floored.setMinutes(flooredMinutes, 0, 0); // set minutes, seconds, milliseconds to 0
    return floored;
  }

  if (session) {
    prices.push(
      ...((await getPrices(locals)).filter((price) =>
        price.start >= floorToNearest30Minutes(new Date())
      ) || []),
    );
    prices.sort((a, b) => a.start.getTime() - b.start.getTime());
    carChargeTimespans.push(...(await getCarChargeTimespan(locals) || []));
  }
  return {
    prices,
    carChargeTimespans,
  };
};
