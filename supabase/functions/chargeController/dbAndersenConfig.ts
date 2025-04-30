import { supabase } from "../_shared/supabaseAdmin.ts";

export const getAndersenChargeConfig = async (userId: string): Promise<
  AndersenChargeConfig
> => {
  const { data: dbChargeConfig, error } = await supabase.from(
    "andersen_config_table",
  )
    .select()
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching charge config from database:", error);
    throw new Error(`Failed to fetch charge config for user ${userId}`);
  }
  return {
    id: dbChargeConfig.id,
    userId: dbChargeConfig.user_id,
    andersenUsername: dbChargeConfig.andersen_username,
    andersenPassword: dbChargeConfig.andersen_password,
    batterySize: dbChargeConfig.battery_size,
    chargeRate: dbChargeConfig.charge_rate,
  };
};
