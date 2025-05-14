import {
  createClient,
  REALTIME_LISTEN_TYPES,
  RealtimeChannel,
  type RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";

let myCallback: (priceChanges: PriceChanges) => void = () => {};

let batchedInserts: Price[] | undefined = undefined;
let batchedUpdates: Price[] | undefined = undefined;
let batchedDeletes: Partial<Price>[] | undefined = undefined;

const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
);

let flushScheduled = false;

const dbPriceToPrice = (dbPrice: Partial<Price>): Price => {
  return {
    ...dbPrice,
    start: new Date(dbPrice.start || 0),
    end: new Date(dbPrice.end || 0),
    tariff: dbPrice.tariff || "",
    price: dbPrice.price || 0,
  };
};

const handleNewPrices = (
  change: RealtimePostgresChangesPayload<Price>,
) => {
  switch (change.eventType) {
    case "DELETE":
      if (!batchedDeletes) batchedDeletes = [];
      if (change.old) {
        batchedDeletes.push(dbPriceToPrice(change.old));
      }
      break;
    case "INSERT":
      if (!batchedInserts) batchedInserts = [];
      if (change.old) batchedInserts.push(dbPriceToPrice(change.new));
      break;
    case "UPDATE":
      if (!batchedUpdates) batchedUpdates = [];
      if (change.old) batchedUpdates.push(dbPriceToPrice(change.new));
      break;
  }

  if (!flushScheduled) {
    flushScheduled = true;
    setInterval(() => {
      if (!batchedUpdates && !batchedInserts && !batchedDeletes) return;

      const batchedChanges: PriceChanges = {
        updates: undefined,
        inserts: undefined,
        deletes: undefined,
      };

      if (batchedUpdates) {
        console.log(
          "returning batched updates to UI",
          JSON.stringify(batchedUpdates),
        );
        batchedChanges.updates = [...batchedUpdates];
        batchedUpdates = undefined;
      }
      if (batchedInserts) {
        console.log(
          "returning batched inserts to UI",
          JSON.stringify(batchedInserts),
        );
        batchedChanges.inserts = [...batchedInserts];
        batchedInserts = undefined;
      }
      if (batchedDeletes) {
        console.log(
          "returning batched deletes to UI",
          JSON.stringify(batchedDeletes),
        );
        batchedChanges.deletes = [...batchedDeletes];
        batchedDeletes = undefined;
      }

      myCallback(batchedChanges);
      flushScheduled = false;
    }, 1000);
  }
};

export const subscribeToPriceChanges = (
  tariff: string,
  callback: (priceChanges: PriceChanges) => void,
) => {
  console.log(
    `subscribing to price changes channel - prices-changes-${tariff}`,
  );
  myCallback = callback;
  return supabase
    .channel(`prices-changes-${tariff}`)
    .on(
      REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
      {
        event: "*",
        schema: "public",
        table: "prices",
        filter: `tariff=eq.${tariff}`,
      },
      handleNewPrices,
    )
    .subscribe();
};

export const unsubscribeFromPriceChanges = (channel: RealtimeChannel) => {
  console.log("unsubscribing from price changes channel");
  channel.unsubscribe();
};
