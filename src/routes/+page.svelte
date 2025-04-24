<script lang='ts'>
	import { Button } from '../lib/components/ui/button';
	
  const { data } = $props()
  const {userProfile} = data;

</script>

{#if userProfile}
  <h1>Welcome back, {userProfile.name}!</h1>
{:else}
  <h1>Welcome to the site!</h1>
  <Button href="/auth/login/github">Sign in with GitHub</Button>
{/if}