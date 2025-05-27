import { error } from "@sveltejs/kit";
import { zfd } from "zod-form-data";
import * as profileDb from "$lib/data/profile";
import * as groupDb from "$lib/data/group";
import { getTariffCode } from "../../lib/thirdPartyAPIs/octopus.js";

export const load = async ({ locals }) => {
  console.info("load running");
  const { user } = await locals.safeGetSession();

  if (!user) {
    console.error("User not found");
    error(401, "Unauthorized");
  }
  console.info("User found");

  return { userProfile: await profileDb.get(user.id) };
};

export const actions = {
  saveProfile: async ({ request, locals }) => {
    console.info("Form submission received");

    const { user } = await locals.safeGetSession();

    if (!user) {
      error(401, "Unauthorized");
    }

    const schema = zfd.formData({
      name: zfd.text(),
      email: zfd.text(),
    });

    const { data, error: parseError } = schema.safeParse(
      await request.formData(),
    );

    if (parseError) {
      console.error(parseError);
      error(400, parseError?.message);
    }

    console.info("geting profile - Parsed data:", data);
    const profile = await profileDb.get(user.id);

    if (profile) console.info("Profile found:", profile);

    if (!profile || !profile.group?.id) {
      const newGroupId = await groupDb.insert({
        name: data.name,
        ownerId: user.id,
      });
      await profileDb.upsert({
        id: user.id,
        name: data.name,
        email: data.email,
        groupId: newGroupId,
      });
    } else {
      await profileDb.upsert({
        id: user.id,
        name: data.name,
        email: data.email,
        groupId: profile?.group.id || "",
      });
    }
    return { success: true };
  },
  saveGroup: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      error(401, "Unauthorized");
    }

    const schema = zfd.formData({
      groupId: zfd.text(),
      groupName: zfd.text(),
      octopusAccountId: zfd.text(),
      octopusAPIKey: zfd.text(),
    });

    const { data, error: parseError } = schema.safeParse(
      await request.formData(),
    );

    if (parseError) {
      console.error(parseError);
      error(400, parseError?.message);
    }

    const group = await groupDb.get(data.groupId);

    if (group && group.ownerId !== user.id) {
      error(403, "You are not the owner of this group");
    }

    const newGroup = {
      name: data.groupName,
      ownerId: user.id,
      octopusTariff: await getTariffCode(
        data.octopusAccountId,
        data.octopusAPIKey,
      ),
      id: group?.id || "",
    };

    if (group) {
      await groupDb.update(newGroup);
    } else {
      await groupDb.insert(newGroup);
    }

    return { success: true };
  },
};
