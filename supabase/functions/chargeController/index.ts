import '@supabase/functions-js';
import * as andersenChargeTimespanDb from './data/dbAndersenChargeTimespan.ts';
import { getAndersenChargeConfig } from './data/dbAndersenConfig.ts';
import AndersenA2 from './andersen/AndersenA2.ts';
import { deletePrices } from './data/dbPrices.ts';

const equalWithFuzziness = (
  date1: Date | undefined,
  date2: Date | undefined,
  fuzzinessInMinutes: number
) => {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;
  const timeDifference = Math.abs(date1.getTime() - date2.getTime());
  const fuzzinessInMilliseconds = fuzzinessInMinutes * 60 * 1000;

  return timeDifference <= fuzzinessInMilliseconds;
};

Deno.serve(async () => {
  console.log("Function 'chargeController' invoked");

  const now = new Date();
  deletePrices(now);

  const chargeTimespans = await andersenChargeTimespanDb.getAll();

  console.log(`found ${chargeTimespans.length} charge timespans`);

  for (const timespan of chargeTimespans) {
    const isStart = equalWithFuzziness(timespan.startTime, now, 5);
    const isEnd = equalWithFuzziness(timespan.endTime, now, 5);

    console.log(`Processing timespan: ${timespan.id}, Start: ${isStart}, End: ${isEnd}`);
    if (isStart || isEnd) {
      try {
        const { andersenUsername, andersenPassword } = await getAndersenChargeConfig(
          timespan.groupId
        );

        if (!andersenUsername || !andersenPassword) {
          console.error(
            `Error fetching car charge config from database for group: ${timespan.groupId}`
          );
          return new Response(JSON.stringify({ error: 'Failed to fetch car charge config' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        console.log('Init AndersenA2 group:', timespan.groupId);

        const andersenA2 = new AndersenA2(andersenUsername, andersenPassword);
        await andersenA2.init();

        if (isStart) {
          await andersenA2.unlock();
        } else {
          await andersenA2.lock();
          await andersenChargeTimespanDb.deleteById(timespan.id);
        }
      } catch (error) {
        console.error(
          `Error during AndersenA2 operation ${timespan.groupId}, ${timespan.startTime}, ${timespan.endTime}:`,
          error
        );
        break;
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chargeController' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
