import { inviteTable } from "$lib/db/schema";
import { db } from "$lib/db";

export const insert = async (invite: {
  email: string;
  groupId: string;
}) => {
  await db.insert(inviteTable).values(invite);
};
