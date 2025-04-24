import { getOrCreateUserProfile } from "../lib/auth";

export const load = async ({ locals }) => {
  console.info("load running");
  const userProfile = await getOrCreateUserProfile(locals);
  return { userProfile };
};
