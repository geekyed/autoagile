import { eq } from "drizzle-orm";
import { db } from "../db";
import { andersenConfigTable } from "../db/schema";

export const getCarChargeTimespan = async (locals: App.Locals) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return null;
  }

  const carChargeTimespans = await db.query.andersenChargeTimespanTable
    .findMany({
      where: eq(andersenConfigTable.userId, user.id),
    });

  return carChargeTimespans;
};
