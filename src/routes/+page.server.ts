import { error, redirect } from "@sveltejs/kit";
import * as andersenConfigDb from "$lib/data/andersenConfig";
import * as profileDb from "$lib/data/profile";
import * as pricesDb from "$lib/data/prices";
import * as carChargeTimespansDb from "$lib/data/andersenChargeTimespan";
import type { PageServerLoad } from "./$types";
import { zfd } from "zod-form-data";
import { createNewChargeTimespans } from "../lib/chargeTimespans";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) {
    return {
      prices: [],
      carChargeTimespans: [],
      carChargeConfig: null,
    };
  }

  const userProfile = await profileDb.get(session.user.id);
  if (!userProfile) {
    console.error("User profile not found, redirecting to profile page");
    redirect(307, "/profile");
  }

  return {
    prices: await pricesDb.get(userProfile.group.octopusTariff ?? ""),
    carChargeTimespans: await carChargeTimespansDb.get(
      userProfile.group.id,
    ),
    carChargeConfig: await andersenConfigDb.get(userProfile.group.id),
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      error(401, "Unauthorized");
    }

    const userProfile = await profileDb.get(user.id);
    if (!userProfile) {
      error(400, "Profile not configured, ensure you have a tariff saved");
    }

    const carChargingConfig = await andersenConfigDb.get(userProfile.group.id);

    if (!carChargingConfig) {
      error(404, "Car config not found, cannot create car charging timespans");
    }

    const schema = zfd.formData({
      chargePercent: zfd.numeric(),
      endTime: zfd.text().refine(
        (val) => !isNaN(Date.parse(val)),
        { message: "Invalid date/time string" },
      ),
    });

    const { data, error: parseError } = schema.safeParse(
      await request.formData(),
    );
    if (parseError) {
      console.error("Error parsing car charging schema");
      error(400, parseError?.message);
    }

    const endDateTime = new Date(data.endTime);

    try {
      console.log("end date time is: ", data.endTime);
      const timespans = await createNewChargeTimespans(
        userProfile.group,
        endDateTime,
        data.chargePercent,
      );
      console.info("Updated car charging config in database", user?.id, data);
      return { success: true, timespans };
    } catch (e) {
      console.error("Error creating new charge timespans", e);
      error(500, "Failed to create new charge timespans");
    }
  },
};
