import { getOrCreateUserProfile } from "../lib/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const { session } = await locals.safeGetSession();

  let userProfile: UserProfile | null | undefined = null;
  if (session) {
    userProfile = await getOrCreateUserProfile(locals);
  }
  return {
    session,
    cookies: cookies.getAll(),
    userProfile,
  };
};
