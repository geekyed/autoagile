import { eq } from "drizzle-orm";
import { db } from "../../db";
import { profileTable } from "../../db/schema";

export const get = async (userId: string): Promise<UserProfile | undefined> => {
  const profileWithGroup = await db.query.profileTable.findFirst({
    where: eq(profileTable.id, userId),
    with: {
      userGroup: {
        with: {
          group: true,
        },
      },
    },
  });
  if (!profileWithGroup) {
    return undefined;
  }

  return {
    id: profileWithGroup.id,
    name: profileWithGroup.name,
    email: profileWithGroup.email,
    group: { ...profileWithGroup.userGroup.group },
  };
};

interface ProfileToSave {
  id: string;
  name: string;
  email: string;
}

export const upsert = async (profile: ProfileToSave) => {
  await db.insert(profileTable).values(profile).onConflictDoUpdate({
    target: [profileTable.id],
    set: {
      name: profile.name,
      email: profile.email,
    },
  });
};
