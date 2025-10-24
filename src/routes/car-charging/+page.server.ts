import { error } from "@sveltejs/kit";
import { zfd } from "zod-form-data";

import * as carConfigDb from "$lib/data/andersenConfig";
import * as profileDb from "$lib/data/profile";
import * as groupDb from "$lib/data/group"

export const load = async ({ locals }) => {
  console.info("load running");

  const { user } = await locals.safeGetSession();

  if (!user) {
    console.error("User not found", user);
    error(401, "Unauthorized");
  }

  const profile = await profileDb.get(user.id)
  if (profile == undefined) return { isReadOnly: true, carChargingConfig: undefined }

  return {
    isReadOnly: profile.group.ownerId !== profile.id,
    carChargingConfig: await carConfigDb.get(profile.group.id)
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();
    if (!user) {
      error(401, "Unauthorized");
    }
    console.info("Car charging config form submission received");

    const group = await groupDb.getByOwner(user.id)

    if (!group) {
      console.warn("Only group owners can modify charge settings.")
      error(401, "Unauthorized - Only group owners can modify charge settings.")
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
      groupId: group.id,
    });

    console.info("Updated car charging config in database", user?.id, data);
    return { success: true };
  },
};
