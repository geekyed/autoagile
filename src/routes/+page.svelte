<script lang='ts'>
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import CreateCarCharge from '../lib/components/custom/createCarCharge.svelte';
	import FuturePricesVisual from '../lib/components/custom/futurePricesVisual.svelte';
	import { subscribeToPriceChanges, unsubscribeFromPriceChanges } from '../lib/push';

  const { data } = $props()
  const {userProfile, prices, carChargeTimespans, carChargeConfig} = data;

  let localPrices = $derived(prices
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .filter(price => price.end.getTime() > new Date().getTime())
  );

  let channel: RealtimeChannel | null = $state(null);

  let chargeTimespans: AndersenChargeTimespan[] = $state([])
  chargeTimespans = [...carChargeTimespans];


  $effect(() => {
    if (userProfile && userProfile.octopusTariff && !channel) {
      channel = subscribeToPriceChanges(userProfile.octopusTariff, (pricesChanges: PriceChanges) => {
        if (pricesChanges.inserts) {
          console.log("adding new prices", pricesChanges.inserts);
          localPrices.push(...pricesChanges.inserts);
          localPrices = localPrices.sort((a, b) => a.start.getTime() - b.start.getTime());
        }
        if (pricesChanges.updates) {
          console.log("updating prices", pricesChanges.updates);
          pricesChanges.updates.forEach(price => {
            const index = localPrices.findIndex(p => p.start.getTime() === price.start.getTime());
            if (index !== -1) {
              localPrices[index] = price;
            }
          });
          localPrices = localPrices.sort((a, b) => a.start.getTime() - b.start.getTime());
        }
        if (pricesChanges.deletes) {
          console.log("deleting prices", pricesChanges.deletes);
          // Filter out prices that match any in the deletes array
          localPrices = localPrices.filter(price => {
            // Check if this price exists in the deletes array
            return !pricesChanges.deletes?.some(deletedPrice => 
              deletedPrice.start && price.start.getTime() === new Date(deletedPrice.start).getTime()
            );
          });
          localPrices = localPrices.sort((a, b) => a.start.getTime() - b.start.getTime());
        }
      });
    }
  });

</script>

{#if userProfile}
<div class='flex flex-col items-center gap-5'>
{#if prices.length > 0}
<div class='flex flex-col flex-grow gap-5 justify-center items-center'>
  <CreateCarCharge carChargingConfig={carChargeConfig} bind:carChargeTimespans={chargeTimespans}/>
  <FuturePricesVisual prices={localPrices} carChargeTimespans={chargeTimespans} />
</div>
{:else}
  <h1 class='text-2xl font-bold'>No prices found</h1>
{/if}
</div>
{:else}
  <h1>Please log in!</h1>
{/if}