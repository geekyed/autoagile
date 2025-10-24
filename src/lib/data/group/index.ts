import { groupTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';

export const insert = async (group: { name: string; ownerId: string; octopusTariff?: string }) => {
  const [newGroup] = await db.insert(groupTable).values(group).returning();
  return newGroup.id;
};

export const update = async (group: Group) => {
  await db.update(groupTable).set(group).where(eq(groupTable.id, group.id));
};

export const get = async (id: string): Promise<Group | undefined> => {
  return await db.query.groupTable.findFirst({
    where: eq(groupTable.id, id)
  });
};

export const getByOwner = async (ownerId: string): Promise<Group | undefined> => {
  return await db.query.groupTable.findFirst({
    where: eq(groupTable.ownerId, ownerId)
  });
};
