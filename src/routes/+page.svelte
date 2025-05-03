<script lang='ts'>
	import Label from '../lib/components/ui/label/label.svelte';
	import CreateCarCharge from '../lib/components/custom/createCarCharge.svelte';
	import FuturePricesD3 from '../lib/components/custom/futurePricesD3.svelte';

  const { data } = $props()
  const {userProfile, prices, carChargeTimespans, carChargeConfig} = data;

  let chargeTimespans: AndersenChargeTimespan[] = $state([])
  chargeTimespans = [...carChargeTimespans];
</script>


{#if userProfile}
<div class='flex flex-col items-center gap-5'>
{#if prices.length > 0}
  <CreateCarCharge carChargingConfig={carChargeConfig} bind:carChargeTimespans={chargeTimespans}/>
  <FuturePricesD3 {prices} carChargeTimespans={chargeTimespans} />
{:else}
  <h1 class='text-2xl font-bold'>No prices found</h1>
{/if}
</div>
{:else}
  <h1>Please log in!</h1>
{/if}