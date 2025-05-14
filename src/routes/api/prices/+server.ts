import { json } from "@sveltejs/kit";
import { getSortedPrices } from "$lib/data/prices";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  console.log("fetching prices");
  const prices = await getSortedPrices(locals);
  return json(prices);
};
