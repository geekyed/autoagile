import { getOrCreateUserProfile } from "$lib/data/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const { session } = await locals.safeGetSession();

  const userProfile: UserProfile | null | undefined = null;
  if (!session) {
    return {
      session,
      cookies: cookies.getAll(),
      userProfile,
    };
  }
  return {
    session,
    cookies: cookies.getAll(),
    userProfile: await getOrCreateUserProfile(locals),
  };
};
