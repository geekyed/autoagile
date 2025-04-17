import { eq } from "drizzle-orm"
import { db } from "../db"
import { profileTable } from "../db/schema"
import { error } from "@sveltejs/kit"

export const getOrCreateUserProfile = async (locals: App.Locals) => {

  const { user } = await locals.safeGetSession();

  if(!user) {
    return null
  }

  const currentProfile = await db.query.profileTable.findFirst({
    where: eq(profileTable.id, user.id)
  });

  if (currentProfile) {
    return currentProfile
  }

  await db.insert(profileTable).values({
    id: user.id,
    email: user.email ?? "",
    name: ''
  });

  const newProfile = db.query.profileTable.findFirst({ where: eq(profileTable.id, user.id) });

  if (!newProfile) {
    error(500, "Failed to create user profile");
  }
  return newProfile;
}