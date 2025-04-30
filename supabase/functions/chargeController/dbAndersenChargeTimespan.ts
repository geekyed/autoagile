import { supabase } from "../_shared/supabaseAdmin.ts";

export const getAndersenChargeTimespans = async (): Promise<
  AndersenChargeTimespan[]
> => {
  const { data, error } = await supabase.from(
    "andersen_charge_timespan_table",
  ).select();

  if (error) {
    console.error("Error fetching chargeTimespans from database:", error);
    return [];
  }
  return data.map((
    dbChargeTimespan,
  ): AndersenChargeTimespan => ({
    userId: dbChargeTimespan.user_id,
    startTime: new Date(dbChargeTimespan.start_time),
    endTime: new Date(dbChargeTimespan.end_time),
    averagePrice: dbChargeTimespan.average_price,
  }));
};
