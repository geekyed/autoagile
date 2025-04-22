// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { getUniqueTariffs } from "./profile/index.ts"

Deno.serve(async () => {
  console.info("Function 'onPricesPublish' invoked")

  const tariffs = await getUniqueTariffs()

  // const responseData = []
  // tariffs.forEach(tariffCode => {
  //   const prices = await getPrices(tariffCode)
  //   console.info(`Prices for ${tariffCode}:`)
  //   prices.forEach(price => {
  //     console.info(`  ${price.start} - ${price.end}: £${price.price}`)
  //     responseData.push({
  //       tariff: price.tariff,
  //       price: price.price,
  //       created: price.created,
  //       start: price.start,
  //       end: price.end,
  //     })
  //   })
  // });

  return new Response(
    JSON.stringify({data: tariffs}),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/onPricesPublish' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
