import { getPrices } from "../lib/prices";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  const prices: Price[] = [];
  if (session) {
    prices.push(
      ...((await getPrices(locals)).filter((price) => {
        return price.start.toDateString() === new Date().toDateString();
      })),
    );
  }
  return {
    prices,
  };
};
