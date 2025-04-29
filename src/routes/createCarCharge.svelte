<script lang='ts'>
  import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Button } from '../lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '../lib/components/ui/card';
	import { Input } from '../lib/components/ui/input';
	import { Label } from '../lib/components/ui/label';

  const { carChargingConfig } = $props()

  let chargePercent = $state(20);
  let endTime = $state('00:00');

</script>
{#if carChargingConfig}
<Card>
  <CardHeader>
    Setup next charge
  </CardHeader>
  <CardContent>
    <form class='flex flex-col gap-2' method="post" use:enhance={({formData}) => {
      formData.set('chargePercent', chargePercent.toString());
      formData.set('endTime', endTime);
      return ({result}) => {
        if (result.type === 'success') {
          invalidate('/');
        } else {
          console.error(result.status, result.type);
          if(result.type === 'error') {
            alert(JSON.stringify(result.error));
          }
        }
      };
    }}>
        <div>
          <Label>Percentage to charge</Label>
          <Input bind:value={chargePercent} />
        </div>
        <div>
          <Label>Charge by time</Label>
          <Input bind:value={endTime} />
        </div>
        <div>
          <Button type='submit'>Update</Button>
        </div>
    </form>
  </CardContent>
</Card>
{/if}