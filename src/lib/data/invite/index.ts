import { inviteTable } from "$lib/db/schema";
import { db } from "$lib/db";

export const insert = async (invite: {
  email: string;
  groupId: string;
}): Promise<string> => {
  const tokens = await db.insert(inviteTable).values(invite).returning({ token: inviteTable.id });
  return tokens.length > 0 ? tokens[0].token! : '';
};
