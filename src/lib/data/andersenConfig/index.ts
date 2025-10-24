import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { andersenConfigTable } from '../../db/schema';

export const get = async (groupId: string) => {
  return await db.query.andersenConfigTable.findFirst({
    where: eq(andersenConfigTable.groupId, groupId)
  });
};

export const upsert = async (config: AndersenConfig) => {
  return await db
    .insert(andersenConfigTable)
    .values(config)
    .onConflictDoUpdate({
      target: [andersenConfigTable.groupId],
      set: config
    })
    .returning();
};
