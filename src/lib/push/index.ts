import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";

interface PricesPayload {
  schema: "public" | "private";
  table: string;
  commit_timestamp: Date;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: {
    end: Date;
    id: string;
    price: number;
    start: Date;
    tariff: string;
  };
  old: object;
  errors: null | object;
  latency: number;
}

let myCallback: (newPrices: Price[]) => void = () => {};

const batchedPrices: Price[] = [];

const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
);

let flushScheduled = false;

const handleNewPrices = (payload: PricesPayload) => {
  batchedPrices.push({
    price: payload.new.price,
    start: new Date(payload.new.start),
    end: new Date(payload.new.end),
    tariff: payload.new.tariff,
  });

  if (!flushScheduled) {
    flushScheduled = true;
    setTimeout(() => {
      console.log(
        "returning batched prices to UI",
        JSON.stringify(batchedPrices),
      );
      myCallback([...batchedPrices]); // Avoid mutation issues
      batchedPrices.length = 0;
      flushScheduled = false;
    }, 1000);
  }
};

export const subscribeToPriceChanges = (
  tariff: string,
  callback: (newPrices: Price[]) => void,
) => {
  console.log(
    `subscribing to price changes channel - prices-changes-${tariff}`,
  );
  myCallback = callback;
  return supabase
    .channel(`prices-changes-${tariff}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
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
