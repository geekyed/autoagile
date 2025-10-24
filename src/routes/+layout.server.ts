import * as profileDb from '$lib/data/profile';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    return {
      session,
      cookies: cookies.getAll(),
      userProfile: undefined
    };
  }
  return {
    session,
    cookies: cookies.getAll(),
    userProfile: await profileDb.get(session.user.id)
  };
};
