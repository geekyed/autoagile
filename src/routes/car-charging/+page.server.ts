import { error } from "@sveltejs/kit";
import { zfd } from "zod-form-data";

import * as carConfigDb from "$lib/data/andersenConfig";
import * as profileDb from "$lib/data/profile";

export const load = async ({ locals }) => {
  console.info("load running");

  const { user } = await locals.safeGetSession();

  if (!user) {
    console.error("User not found", user);
    error(401, "Unauthorized");
  }

  const profile = await profileDb.get(user.id);
  if (!profile) {
    console.error("Profile not found");
    error(400, "profile not configured");
  }

  return {
    carChargingConfig: await carConfigDb.get(profile.group.id),
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) {
      error(401, "Unauthorized");
    }
    console.info("Car charging config form submission received");

    const profile = await profileDb.get(user.id);
    if (!profile) {
      error(400, "profile not configured");
    }

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

    await carConfigDb.upsert({
      ...data,
      groupId: profile.group.id,
    });

    console.info("Updated car charging config in database", user?.id, data);
    return { success: true };
  },
};
