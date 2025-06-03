import { db } from "../../db";
import { and, eq } from "drizzle-orm";
import { userGroups } from "../../db/schema";

export const upsert = async (userId: string, groupId: string) => {
  await db.insert(userGroups).values({ userId, groupId }).onConflictDoUpdate({
    target: [userGroups.userId, userGroups.groupId],
    set: { groupId },
  });
};

export const remove = async (userId: string, groupId: string) => {
  await db.delete(userGroups).where(
    and(eq(userGroups.userId, userId), eq(userGroups.groupId, groupId)),
  );
};
