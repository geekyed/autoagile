import { eq } from "drizzle-orm";
import { db } from "../../db";
import { profileTable } from "../../db/schema";

export const get = async (userId: string): Promise<UserProfile | undefined> => {
  const profile = await db.query.profileTable.findFirst({
    where: eq(profileTable.id, userId),
    with: {
      group: true,
    },
  });
  if (!profile) {
    console.error("Profile not found");
    return undefined;
  }
  return {
    id: profile?.id,
    name: profile?.name,
    email: profile?.email,
    group: {
      id: profile.group!.id,
      name: profile?.group!.name,
      ownerId: profile?.group!.ownerId,
      octopusTariff: profile?.group?.octopusTariff || "",
    },
  };
};

interface ProfileToSave {
  id: string;
  name: string;
  email: string;
  groupId: string;
}

export const upsert = async (profile: ProfileToSave) => {
  await db.insert(profileTable).values(profile).onConflictDoUpdate({
    target: [profileTable.id],
    set: {
      name: profile.name,
      email: profile.email,
      groupId: profile.groupId,
    },
  });
};
