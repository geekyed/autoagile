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
    setInterval(() => {
      localPrices = localPrices.filter(price => price.end.getTime() > new Date().getTime());
      localPrices.sort((a, b) => a.start.getTime() - b.start.getTime());
    }, 3000)
  })

  $effect(() => {
    if (userProfile && userProfile.octopusTariff && !channel) {
      channel = subscribeToPriceChanges(userProfile.octopusTariff, (newPrices: Price[]) => {
        localPrices.length = 0; 
        console.log("adding new prices", newPrices);
        const foo = newPrices.sort((a, b) => a.start.getTime() - b.start.getTime()).filter(price => price.end.getTime() > new Date().getTime());
        localPrices.push(...foo)});
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