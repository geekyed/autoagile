import { eq } from "drizzle-orm";
import { db } from "../../db";
import {
  andersenChargeTimespanTable,
  andersenConfigTable,
} from "../../db/schema";

export const getByGroup = async (
  groupId: string,
): Promise<AndersenChargeTimespan[]> => {
  const carChargeTimespans = await db.query.andersenChargeTimespanTable
    .findMany({
      where: eq(andersenConfigTable.groupId, groupId),
    });

  if (!carChargeTimespans) {
    return [];
  }

  return carChargeTimespans;
};

export const deleteAll = async (groupId: string) => {
  await db.delete(andersenChargeTimespanTable).where(
    eq(andersenChargeTimespanTable.groupId, groupId),
  );
};

export const insert = async (
  timespans: PreDBAndersenChargeTimespan[],
) => {
  await db.insert(andersenChargeTimespanTable).values(timespans)
    .onConflictDoNothing();
};
