<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navigation from '../lib/components/custom/navigation.svelte';
	import { Button } from '../lib/components/ui/button';
	import { ModeWatcher } from "mode-watcher";
	import DarkMode from '../lib/components/custom/darkMode.svelte';

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

<div class="relative flex items-center justify-center p-4">
  <h1 class="text-3xl font-semibold">Octomiser</h1>
  <div class="absolute right-4 flex gap-2">
    {#if userProfile === null}
			<Button variant='secondary' href="/auth/login/github">Sign in with GitHub</Button>
		{:else}
			<Button variant='secondary' href="/auth/logout">Logout</Button>
		{/if}
		<DarkMode/>
  </div>
</div>
{#if userProfile}
	<Navigation/>
{/if}

<ModeWatcher />

{@render children()}

