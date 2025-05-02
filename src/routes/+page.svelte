<script lang='ts'>
	import Label from '../lib/components/ui/label/label.svelte';
	import { ScrollArea } from '../lib/components/ui/scroll-area';
	import CreateCarCharge from '../lib/components/custom/createCarCharge.svelte';
	import FuturePricesD3 from '../lib/components/custom/futurePricesD3.svelte';

  const { data } = $props()
  const {userProfile, prices, carChargeTimespans, carChargeConfig} = data;

  let chargeTimespans: AndersenChargeTimespan[] = $state([])
  chargeTimespans = [...carChargeTimespans];

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const pricesToday = prices.filter((price) => price.start.getDay() === today.getDay());
  const pricesTomorrow = prices.filter((price) => price.start.getDay() === tomorrow.getDay());
</script>


{#if userProfile}
<div class='flex flex-col items-center gap-5'>
{#if pricesToday.length > 0}
  <CreateCarCharge carChargingConfig={carChargeConfig} bind:carChargeTimespans={chargeTimespans}/>
  <Label>{today.toLocaleDateString()}</Label>
  <ScrollArea>
    <div class="max-h-[20rem] max-w-[20rem]">
            <FuturePricesD3 prices={pricesToday} carChargeTimespans={chargeTimespans} />
    </div>
  </ScrollArea>
{:else}
  <h1 class='text-2xl font-bold'>No prices for today</h1>
{/if}

{#if pricesTomorrow.length > 0}
  <Label>{tomorrow.toLocaleDateString()}</Label>
  <ScrollArea>
    <div class="max-h-[20rem] max-w-[20rem]">
            <FuturePricesD3 prices={pricesTomorrow} carChargeTimespans={chargeTimespans} />
    </div>
  </ScrollArea>
{/if}
</div>
{:else}
  <h1>Please log in!</h1>
{/if}