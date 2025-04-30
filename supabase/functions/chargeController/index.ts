// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getAndersenChargeTimespans } from "./dbAndersenChargeTimespan.ts";
import { getAndersenChargeConfig } from "./dbAndersenConfig.ts";
import AndersenA2 from "./andersen/AndersenA2.ts";

Deno.serve(async () => {
  console.log("Function 'chargeController' invoked");

  const now = new Date();
  const chargeTimespans = await getAndersenChargeTimespans();

  for (const timespan of chargeTimespans) {
    const isStart = equalWithFuzziness(timespan.startTime, now, 5);
    const isEnd = equalWithFuzziness(timespan.endTime, now, 5);
    if (isStart || isEnd) {
      try {
        const { andersenUsername, andersenPassword } =
          await getAndersenChargeConfig(timespan.userId);

        if (!andersenUsername || !andersenPassword) {
          console.error(
            `Error fetching car charge config from database for user: ${timespan.userId}`,
          );
          return new Response(
            JSON.stringify({ error: "Failed to fetch car charge config" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const andersenA2 = new AndersenA2(andersenUsername, andersenPassword);
        await andersenA2.init();

        if (isStart) {
          await andersenA2.unlock();
        } else {
          await andersenA2.lock();
        }
      } catch (error) {
        console.error(
          `Error during AndersenA2 operation ${timespan.userId}, ${timespan.startTime}, ${timespan.endTime}:`,
          error,
        );
        break;
      }
    }
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } },
  );
});

const equalWithFuzziness = (
  date1: Date | undefined,
  date2: Date | undefined,
  fuzzinessInMinutes: number,
) => {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;
  const timeDifference = Math.abs(date1.getTime() - date2.getTime());
  const fuzzinessInMilliseconds = fuzzinessInMinutes * 60 * 1000;

  return timeDifference <= fuzzinessInMilliseconds;
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chargeController' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
