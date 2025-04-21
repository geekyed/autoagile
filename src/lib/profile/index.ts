import { db } from "../db"
import { pricesTable } from "../db/schema"
import { error } from "@sveltejs/kit"

export const getUniqueTariffs = async (): Promise<string[]> => {

  const tariffs = await db.selectDistinct({tariff: pricesTable.tariff}).from(pricesTable)

  if (tariffs.length === 0) {
    throw error(500, "No tariffs found")
  }
  return tariffs.map((tariff) => tariff.tariff)
}