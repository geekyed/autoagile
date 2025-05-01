<script lang='ts'>
  import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Button } from '../ui/button';
	import { Card, CardContent, CardHeader } from '../ui/card';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import { Slider } from '../ui/slider';

  interface PropsType {
    carChargingConfig: AndersenChargeConfig | null;
    carChargeTimespans: AndersenChargeTimespan[];
  }

  let { carChargingConfig, carChargeTimespans = $bindable() }: PropsType = $props()

  let averagePrice = $derived(() => {
    if (carChargeTimespans.length === 0) return 0;
    const totalPrice = carChargeTimespans.reduce((acc, timespan) => acc + timespan.averagePrice, 0);
    return totalPrice / carChargeTimespans.length;
  });

  let chargePercent = $state(20);
  let endTime = $state('00:00');

</script>
{#if carChargingConfig}
<Card class='w-full max-w-xl'>
  <CardHeader>
    Setup next charge
  </CardHeader>
  <CardContent>
    <form class='flex flex-col gap-5' method="post" use:enhance={({formData}) => {
      formData.set('chargePercent', chargePercent.toString());
      formData.set('endTime', endTime);
      return ({result}) => {
        if (result.type === 'success') {
          console.log('Success', result?.data?.timespans);
          carChargeTimespans = (result?.data?.timespans as AndersenChargeTimespan[]);
          invalidate('/');
        } else {
          console.error(result.status, result.type);
          if (result.type === 'error') {
            alert(result.error.message);
          }
        }
      };
    }}>
      <div class='flex flex-col gap-2'>
        <Label>Percentage to charge</Label>
        <div class='flex flex-row items-center gap-2'> 
          <Slider type='single' bind:value={chargePercent} max={100} step={5} />
          <Label>{chargePercent}%</Label>
        </div>
      </div>
      <div class='flex flex-col gap-2'>
        <Label>Charge by time</Label>
        <Input bind:value={endTime} />
      </div>
      <div class='flex flex-row gap-2'>
        <Button type='submit'>Update</Button>
        <div class="flex flex-col items-center gap-2">
          <Label>Average Price</Label>
          <Label>{Math.floor(averagePrice()*10)/10}p</Label>
        </div>
      </div>
    </form>
  </CardContent>
</Card>
{/if}