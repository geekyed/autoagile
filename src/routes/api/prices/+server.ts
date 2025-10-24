import { error, json } from '@sveltejs/kit';
import * as pricesDb from '$lib/data/prices';
import * as profileDb from '$lib/data/profile';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  console.log('fetching prices');

  const { user } = await locals.safeGetSession();
  if (!user) {
    error(401, 'Unauthorized');
  }

  const profile = await profileDb.get(user.id);
  if (!profile || !profile.group.octopusTariff) {
    error(400, 'profile not configured, ensure you have a tariff saved');
  }

  const prices = await pricesDb.get(profile.group.octopusTariff);
  return json(prices);
};
