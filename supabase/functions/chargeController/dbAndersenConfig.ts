import { supabase } from "../_shared/supabaseAdmin.ts";

export const getAndersenChargeConfig = async (groupId: string): Promise<
  AndersenConfig
> => {
  const { data: config, error } = await supabase.from(
    "andersen_config",
  )
    .select()
    .eq("group_id", groupId)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching charge config from database:", error);
    throw new Error(`Failed to fetch charge config for group ${groupId}`);
  }
  return {
    groupId: config.group_id,
    andersenUsername: config.andersen_username,
    andersenPassword: config.andersen_password,
    batterySize: config.battery_size,
    chargeRate: config.charge_rate,
  } as AndersenConfig;
};
