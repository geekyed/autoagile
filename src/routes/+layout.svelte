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

<div class="flex items-center justify-between p-4 gap-4">
  <div class="w-10 sm:w-24"></div>
  <h1 class="flex-grow text-center text-4xl font-semibold">Octomiser</h1>
  <div class="flex gap-2 items-center">
    {#if userProfile === null}
      <Button variant="secondary" href="/auth/login/github">Sign in with GitHub</Button>
    {:else}
      <Button variant="secondary" href="/auth/logout">Logout</Button>
    {/if}
    <DarkMode />
  </div>
</div>

{#if userProfile}
	<Navigation/>
{/if}

<ModeWatcher />

{@render children()}

