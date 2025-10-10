import { supabase } from "./supabaseAdmin.ts";

export const getAll = async (): Promise<
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
    id: dbChargeTimespan.id,
    groupId: dbChargeTimespan.group_id,
    startTime: new Date(dbChargeTimespan.start_time),
    endTime: new Date(dbChargeTimespan.end_time),
    averagePrice: dbChargeTimespan.average_price,
  }));
};

export const deleteById = async (id: string): Promise<void> => {
  const { error } = await supabase.from(
    "andersen_charge_timespan_table",
  ).delete().eq("id", id);

  if (error) {
    console.error(`Error deleting chargeTimespan with id ${id}:`, error);
    throw new Error(`Failed to delete chargeTimespan with id ${id}`);
  }
};
