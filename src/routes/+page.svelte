<script lang='ts'>
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import CreateCarCharge from '$lib/components/custom/createCarCharge.svelte';
	import FuturePricesVisual from '$lib/components/custom/futurePricesVisual.svelte';
	import { subscribeToPriceChanges } from '$lib/push';

	// Debounce utility function
	function debounce<T extends (...args: any[]) => any>(
		func: T,
		wait: number
	): (...args: Parameters<T>) => void {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), wait);
		};
	}

	// Utility function for sorting prices
	const sortPrices = (prices: Price[]) => 
		prices.sort((a, b) => a.start.getTime() - b.start.getTime());

	// Props should be accessed through data prop in SvelteKit
	const { data } = $props();
	const { userProfile, prices, carChargeTimespans, carChargeConfig } = data;

	let visibilityHandlerRegistered = false;
	let localPrices = $derived(sortPrices(
		prices.filter(price => price.end.getTime() > new Date().getTime())
	));

	let channel: RealtimeChannel | null = $state(null);
	let chargeTimespans: AndersenChargeTimespan[] = $state([...carChargeTimespans]);

	// Debounced visibility change handler
	const handleVisibilityChange = debounce(async () => {
		console.log("visibilitychange", document.visibilityState);
		if (document.visibilityState !== 'hidden') {
			try {
				const response = await fetch('/api/prices');
				if (!response.ok) throw new Error('Failed to fetch prices');
				const newPrices = await response.json();
				console.log("newPrices on visibility change", newPrices);
				const withDates: Price[] = newPrices.map((price: Price) => ({
					start: new Date(price.start),
					end: new Date(price.end),
					tariff: price.tariff,
					price: price.price,
				}));
				localPrices = sortPrices(withDates);
			} catch (error) {
				console.error('Error fetching prices:', error);
			}
		}
	}, 3000);

	$effect(() => {
		if (visibilityHandlerRegistered) return;
		visibilityHandlerRegistered = true;
		document.addEventListener('visibilitychange', handleVisibilityChange);
	});

	// Price update handlers
	const handlePriceInserts = (inserts: Price[]) => {
		console.log("adding new prices", inserts);
		localPrices.push(...inserts);
		localPrices = sortPrices(localPrices);
	};

	const handlePriceUpdates = (updates: Price[]) => {
		console.log("updating prices", updates);
		updates.forEach(price => {
			const index = localPrices.findIndex(p => p.start.getTime() === price.start.getTime());
			if (index !== -1) {
				localPrices[index] = price;
			}
		});
		localPrices = sortPrices(localPrices);
	};

	const handlePriceDeletes = (deletes: Partial<Price>[]) => {
		console.log("deleting prices", deletes);
		localPrices = localPrices.filter(price => 
			!deletes.some(deletedPrice => 
				deletedPrice.start && price.start.getTime() === new Date(deletedPrice.start).getTime()
			)
		);
		localPrices = sortPrices(localPrices);
	};

	$effect(() => {
		if (userProfile?.octopusTariff && !channel) {
			channel = subscribeToPriceChanges(userProfile.octopusTariff, (pricesChanges: PriceChanges) => {
				try {
					if (pricesChanges.inserts) handlePriceInserts(pricesChanges.inserts);
					if (pricesChanges.updates) handlePriceUpdates(pricesChanges.updates);
					if (pricesChanges.deletes) handlePriceDeletes(pricesChanges.deletes);
				} catch (error) {
					console.error('Error handling price changes:', error);
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