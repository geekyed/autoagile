import { eq } from "drizzle-orm";
import { db } from "../db";
import { andersenConfigTable } from "../db/schema";
import { error } from "@sveltejs/kit";

export const getOrCreateCarConfig = async (
  locals: App.Locals,
) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return null;
  }

  const currentCarConfig = await db.query.andersenConfigTable.findFirst({
    where: eq(andersenConfigTable.userId, user.id),
  });

  if (currentCarConfig) {
    return currentCarConfig as AndersenChargeConfig;
  }

  await db.insert(andersenConfigTable).values({
    userId: user.id,
    andersenUsername: "",
    andersenPassword: "",
    batterySize: 0,
    chargeRate: 0,
  });

  const newConfig = await db.query.andersenConfigTable.findFirst({
    where: eq(andersenConfigTable.userId, user.id),
  });

  if (!newConfig) {
    error(500, "Failed to create car charging configuration");
  }
  return newConfig as AndersenChargeConfig;
};
