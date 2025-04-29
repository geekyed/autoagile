<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navigation from './navigation.svelte';
	import { Button } from '../lib/components/ui/button';

	let { data: propsData, children } = $props();
	let { session, supabase, userProfile } = $derived(propsData);

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="flex flex-col items-center gap-10">
	<div class="flex flex-row items-center justify-between w-full max-w-3xl p-4">
		<h1>Octomiser</h1>
		{#if userProfile === null}
			<Button variant='secondary' href="/auth/login/github">Sign in with GitHub</Button>
		{:else}
			<Button variant='secondary' href="/auth/logout">Logout</Button>
		{/if}
	</div>
	<Navigation {userProfile}/>
</div>

{@render children()}

