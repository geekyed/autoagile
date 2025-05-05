<script lang='ts'>
	import CreateCarCharge from '../lib/components/custom/createCarCharge.svelte';
	import FuturePricesVisual from '../lib/components/custom/futurePricesVisual.svelte';

  const { data } = $props()
  const {userProfile, prices, carChargeTimespans, carChargeConfig} = data;

  let chargeTimespans: AndersenChargeTimespan[] = $state([])
  chargeTimespans = [...carChargeTimespans];
</script>

{#if userProfile}
<div class='flex flex-col items-center gap-5'>
{#if prices.length > 0}
<div class='flex flex-col flex-grow gap-5 justify-center items-center'>
  <CreateCarCharge carChargingConfig={carChargeConfig} bind:carChargeTimespans={chargeTimespans}/>
  <FuturePricesVisual {prices} carChargeTimespans={chargeTimespans} />
</div>
{:else}
  <h1 class='text-2xl font-bold'>No prices found</h1>
{/if}
</div>
{:else}
  <h1>Please log in!</h1>
{/if}