import { error } from "@sveltejs/kit";
import { getOrCreateUserProfile } from "../../lib/auth";
import { zfd } from "zod-form-data";
import { db } from "../../lib/db";
import { profileTable } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { getTariffCode } from "../../lib/octopus";

export const load = async ({ locals }) => {
  console.info("load running");
  const userProfile = await getOrCreateUserProfile(locals);
  return { userProfile };
};

export const actions = {
  default: async ({ request, locals }) => {
    console.info("Form submission received");
    const userProfile = await getOrCreateUserProfile(locals);
    if (!userProfile) {
      error(401, "Unauthorized");
    }

    const schema = zfd.formData({
      name: zfd.text(),
      email: zfd.text(),
      octopusAccountId: zfd.text(),
      octopusAPIKey: zfd.text(),
    });

    const { data, error: parseError } = schema.safeParse(
      await request.formData(),
    );
    if (parseError) {
      error(400, parseError?.message);
    }

    const tariffCode = !userProfile.octopusTariff
      ? await getTariffCode(data.octopusAccountId, data.octopusAPIKey)
      : userProfile.octopusTariff;

    await db.update(profileTable).set({
      name: data.name,
      email: data.email,
      octopusAccountId: data.octopusAccountId,
      octopusAPIKey: data.octopusAPIKey,
      octopusTariff: tariffCode,
    }).where(eq(profileTable.id, userProfile.id));

    return { success: true };
  },
};
