import { error } from '@sveltejs/kit';
import { getOrCreateUserProfile } from '../lib/auth';
import { zfd } from "zod-form-data";
import { db } from '../lib/db';
import { profileTable } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({locals}) => {
  const userProfile = await getOrCreateUserProfile(locals)
  return { userProfile }
}

export const actions = {
  default: async ({ request, locals }) => {
    const userProfile = await getOrCreateUserProfile(locals);
    if(!userProfile) {
      error(401, 'Unauthorized');
    }

    const schema = zfd.formData({
      name: zfd.text(),
      email: zfd.text(),
    });

    const { data, error: parseError } = schema.safeParse(await request.formData());
    if (parseError) {
      error(400, parseError?.message);
    }

    await db.update(profileTable).set({
      name: data.name,
      email: data.email,
    }).where(eq(profileTable.id, userProfile.id));

    return { success: true };
  }
}