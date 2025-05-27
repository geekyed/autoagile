import { eq } from "drizzle-orm";
import { db } from "../../db";
import {
  andersenChargeTimespanTable,
  andersenConfigTable,
} from "../../db/schema";

export const get = async (id: string): Promise<AndersenChargeTimespan[]> => {
  const carChargeTimespans = await db.query.andersenChargeTimespanTable
    .findMany({
      where: eq(andersenConfigTable.groupId, id),
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
  id: string,
  timespans: AndersenChargeTimespan[],
) => {
  const toInsert = timespans.map((timespan) => ({ groupId: id, ...timespan }));
  await db.insert(andersenChargeTimespanTable).values(toInsert);
};
