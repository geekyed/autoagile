import { error } from "@sveltejs/kit";
import { zfd } from "zod-form-data";
import { db } from "../../lib/db";
import { andersenConfigTable } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { getOrCreateCarConfig } from "../../lib/carConfig";

export const load = async ({ locals }) => {
  console.info("load running");
  return { carChargingConfig: await getOrCreateCarConfig(locals) };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    console.info("Car charging config form submission received");
    const carChargingConfig = await getOrCreateCarConfig(locals);
    if (!carChargingConfig) {
      console.error("Car charging config not found");
      error(401, "Unauthorized");
    }

    console.info(
      "Gotten or created car charging config",
      JSON.stringify(carChargingConfig),
    );

    const schema = zfd.formData({
      andersenUsername: zfd.text(),
      andersenPassword: zfd.text(),
      batterySize: zfd.numeric(),
      chargeRate: zfd.numeric(),
    });

    const { data, error: parseError } = schema.safeParse(
      await request.formData(),
    );
    if (parseError) {
      console.error("Error parsing car changing schema");
      error(400, parseError?.message);
    }

    await db.update(andersenConfigTable).set({
      ...data,
    }).where(eq(andersenConfigTable.userId, user?.id || ""));

    console.info("Updated car charging config in database", user?.id, data);
    return { success: true };
  },
};
