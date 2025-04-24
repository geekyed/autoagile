<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navigation from './navigation.svelte';

	let { data: propsData, children } = $props();
	let { session, supabase } = $derived(propsData);

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="flex flex-col items-center">
	<h1>Octomiser</h1>
	<Navigation { session }/>
</div>

{@render children()}

