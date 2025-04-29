<script lang='ts'>
	import Label from '../lib/components/ui/label/label.svelte';
	import { ScrollArea } from '../lib/components/ui/scroll-area';
	import CreateCarCharge from './createCarCharge.svelte';
	import FuturePricesD3 from './futurePricesD3.svelte';

  const { data } = $props()
  const {userProfile, prices, carChargeTimespans, carChargeConfig} = data;

  let chargeTimespans: AndersenChargeTimespan[] = $state([])
  chargeTimespans = [...carChargeTimespans];

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const pricesToday = prices.filter((price) => price.start.getDay() === today.getDay());
  const pricesTomorrow = prices.filter((price) => price.start.getDay() === tomorrow.getDay());

  console.log(pricesToday);
  console.log(carChargeTimespans);

  $effect(() => {
    console.log('chargeTimespans changed!!', chargeTimespans);
  });
</script>

{#if userProfile}
<div class='flex flex-col items-center gap-5'>
  <CreateCarCharge carChargingConfig={carChargeConfig} bind:carChargeTimespans={chargeTimespans}/>
  <Label>{pricesToday[0].start.toDateString()}</Label>
  <ScrollArea class="flex flex-row items-center h-[300px] w-[300px] rounded-md border p-4">
      <FuturePricesD3 prices={pricesToday} carChargeTimespans={chargeTimespans} />
  </ScrollArea>
  
{#if pricesTomorrow.length > 0}
  <Label>{pricesToday[0].start.toDateString()}</Label>
  <ScrollArea class="flex flex-row items-center h-[300px] w-[300px] rounded-md border p-4">
      <FuturePricesD3 prices={pricesTomorrow} carChargeTimespans={chargeTimespans} />
  </ScrollArea>
{/if}
</div>
{:else}
  <h1>Please log in!</h1>
{/if}