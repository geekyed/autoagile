<script lang='ts'>
	import { usersSync } from 'drizzle-orm/neon';
	import { Button } from '../lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '../lib/components/ui/card';
	import Input from '../lib/components/ui/input/input.svelte';
	import { Label } from '../lib/components/ui/label';

  const { data } = $props()
</script>

{#if data.userProfile}
<Card>
  <CardHeader>
    Manage your profile
  </CardHeader>
  <CardContent>
    <form>
        <div>    
          <Label>Email</Label>
          <Input value={data.userProfile.email}></Input>
        </div>
        <div>    
          <Label>Name</Label>
          <Input value={data.userProfile.name}/>
        </div>
        <div>
          <Button type='submit'>Update</Button>
        </div>
    </form>
  </CardContent>
</Card>
{:else}
  <h1>Welcome to the site!</h1>
  <Button href="/auth/login/github">Sign in with GitHub</Button>
{/if}