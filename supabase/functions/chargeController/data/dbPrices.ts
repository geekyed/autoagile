import { supabase } from "./supabaseAdmin.ts";

export const deletePrices = async (
  end: Date,
): Promise<void> => {
  console.log(`deleting price with end: ${end}`);

  const { error } = await supabase.from("prices").delete().lt(
    "end",
    end.toISOString(),
  );
  if (error) {
    console.error("Error deleting prices from database:", error);
  }
};
