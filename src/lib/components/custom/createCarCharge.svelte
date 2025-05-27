<script lang='ts'>
  import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Button } from '../ui/button';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
	import { Input } from '../ui/input';
	import { Label } from '../ui/label';
	import { Slider } from '../ui/slider';

  interface PropsType {
    carChargingConfig: AndersenChargeConfig | null | undefined;
    carChargeTimespans: AndersenChargeTimespan[];
  }

  let { carChargingConfig, carChargeTimespans = $bindable() }: PropsType = $props()

  const msIn30m = 1000 * 60 * 30;

  let { averagePrice, number30mSlots} = $derived.by(() => {
    if (carChargeTimespans.length === 0) return { averagePrice: 0, number30mSlots: 0};
    return carChargeTimespans.reduce<{ averagePrice: number, number30mSlots: number}>((acc, timespan) => {
      const no30mSlotsInSpan = (timespan.endTime.getTime() - timespan.startTime.getTime()) / msIn30m;
      const newNo30mSlots = acc.number30mSlots + no30mSlotsInSpan
      return {
        averagePrice: ((acc.averagePrice * acc.number30mSlots) + (timespan.averagePrice * no30mSlotsInSpan)) / newNo30mSlots,
        number30mSlots: newNo30mSlots
    }},{
      averagePrice: 0,
      number30mSlots: 0
    });
  });

  let chargePercent = $state(20);
  let endTime = $state('00:00');

  const getNextDateTime = (toTime: string): Date => {
    const now = new Date();
    const [hours, minutes] = toTime.split(':').map(Number);

    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);

    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    return target;
  };

  let endDateTime = $derived.by(() => {
    return getNextDateTime(endTime);
  });
  

  let chargeText = $derived.by(() => {
    if (carChargeTimespans.length === 0) return 'No charge set';
    return `Charge set for ${number30mSlots/2}hrs at ${Math.floor(100* averagePrice)/100}p`
  });
</script>
{#if carChargingConfig}
<Card class='w-full max-w-xl'>
  <CardHeader>
    <CardTitle>Car Charge</CardTitle>
    <CardDescription>{chargeText}</CardDescription>
  </CardHeader>
  <CardContent>
    <form class='flex flex-col gap-5' method="post" use:enhance={({formData}) => {
      formData.set('chargePercent', chargePercent.toString());
      formData.set('endTime', endDateTime.toString());
      return ({result}) => {
        if (result.type === 'success') {
          console.log('Success', result?.data?.timespans);
          carChargeTimespans = (result?.data?.timespans as AndersenChargeTimespan[]);
          if(carChargeTimespans.length === 0) {
            alert('Deleted all charging times.')
          }
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
      <div class='flex flex-row gap-5 items-end'>
        <div class='flex flex-col gap-2'>
          <Label>Until</Label>
          <Input type='time' bind:value={endTime} />
        </div>
        <Button type='submit'>Create charge</Button>
      </div>
    </form>
  </CardContent>
</Card>
{/if}