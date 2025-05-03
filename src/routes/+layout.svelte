<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navigation from '../lib/components/custom/navigation.svelte';
	import { Button } from '../lib/components/ui/button';
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import DarkMode from '../lib/components/custom/darkMode.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { BatteryCharging, Github, LogOut, Menu, Moon, Settings, Sun, User } from '@lucide/svelte';

	let { data: propsData, children } = $props();
	let { session, supabase, userProfile } = $derived(propsData);

	let windowInnerWidth = $state(0)

	$effect(() => {
		windowInnerWidth = window.innerWidth
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
	{#if windowInnerWidth > 768}
		<div class="flex gap-2 items-center">
			{#if userProfile === null}
				<Button variant="secondary" href="/auth/login/github">Sign in with GitHub</Button>
			{:else}
				<Button variant="secondary" href="/auth/logout">Logout</Button>
			{/if}
			<DarkMode />
		</div>
	{:else}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger><Menu/></DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item ><BatteryCharging /><a href='/'>Charge</a></DropdownMenu.Item>
						<DropdownMenu.Item ><User/><a href='profile'>Profile</a></DropdownMenu.Item>
						<DropdownMenu.Item ><Settings/><a href='car-charging'>Car Config</a></DropdownMenu.Item>
						<DropdownMenu.Separator />
					</DropdownMenu.Group>
				<DropdownMenu.Group>
				{#if userProfile === null}
					<DropdownMenu.Item>
						<a href='/auth/login/github'><Github/>Sign in with GitHub</a>
					</DropdownMenu.Item>	
				{:else}
					<DropdownMenu.Item>
						<LogOut/><a href="/auth/logout">Logout</a>
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	{/if}

</div>

{#if userProfile && windowInnerWidth>768}
	<Navigation/>
{/if}

<ModeWatcher />

{@render children()}

