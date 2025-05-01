<script lang='ts'>
	import { Button } from '../../lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '../../lib/components/ui/card';
	import Input from '../../lib/components/ui/input/input.svelte';
	import { Label } from '../../lib/components/ui/label';
  import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';

  const { data } = $props()
  const {carChargingConfig} = data;

  let andersenUsername = $state('');
  let andersenPassword = $state('');
  let batterySize = $state(0);
  let chargeRate = $state(0);

  $effect(() => {
    if (carChargingConfig) {
      andersenUsername = carChargingConfig.andersenUsername || '';
      andersenPassword = carChargingConfig.andersenPassword || '';
      batterySize = carChargingConfig.batterySize || 0;
      chargeRate = carChargingConfig.chargeRate || 0;
    }
  });

</script>
{#if carChargingConfig}
<div class='flex flex-col items-center gap-5'>
  <Card class='w-full max-w-xl'>
    <CardHeader>
      Manage your Car Charging Configuration
    </CardHeader>
    <CardContent>
      <form class='flex flex-col gap-2' method="post" use:enhance={({formData}) => {
        formData.set('andersenUsername', andersenUsername);
        formData.set('andersenPassword', andersenPassword);
        formData.set('batterySize', batterySize.toString());
        formData.set('chargeRate', chargeRate.toString());
        return ({result}) => {
          if (result.type === 'success') {
            invalidate("/");
          } else {
            console.error(result.status, result.type);
          }
        };
      }}>
          <div>
            <Label>Andersen Username</Label>
            <Input bind:value={andersenUsername} />
          </div>
          <div>
            <Label>Andersen Password</Label>
            <Input bind:value={andersenPassword} />
          </div>
          <div>
            <Label>Charge Rate kW</Label>
            <Input bind:value={chargeRate} />
          </div>
          <div>
            <Label>Battery Size kWh</Label>
            <Input bind:value={batterySize} />
          </div>
          <div>
            <Button type='submit'>Update</Button>
          </div>
      </form>
    </CardContent>
  </Card>
</div>
{/if}