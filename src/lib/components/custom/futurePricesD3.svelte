<script lang="ts">
	import { BatteryCharging } from "@lucide/svelte";
	import { Card, CardContent } from "../ui/card";
	import CardHeader from "../ui/card/card-header.svelte";
	import { Label } from "../ui/label";
	import { ScrollArea } from "../ui/scroll-area";

  const { prices, carChargeTimespans }: { prices: Price[]; carChargeTimespans: AndersenChargeTimespan[] } = $props();

  const getColor = (value: number): string => {
    if (value === 999) return "#ffffff"; 
    if (value < 0) return "#c084fc";
    if (value < 5) return "#60a5fa"; 
    if (value < 10) return "#4adec5";
    if (value < 15) return "#4ade5b";
    if (value < 20) return "#facc15";
    if (value < 25) return "#f97316";
     return "#f43f5e";
  }

  const isCharging = (start: Date, end: Date) => {
    return carChargeTimespans.some(span =>
      span.startTime <= start && span.endTime >= end
    );
  }
</script>

<Card class='w-full max-w-xl flex flex-col items-center min-h-fit'>
  <CardHeader>
    {prices[0].start.toLocaleDateString()}
  </CardHeader>
  <CardContent>
    <ScrollArea>
      <div class="flex flex-col justify-centre gap-1 w-[22rem] max-w-[32rem] max-h-72">
        {#each prices as price}
          <div
            class="flex gap-2 min-h-10 justify-center p-2"
            style="background-color: {getColor(price.price)}"
          >
            <div class="text-gray-800 font-medium flex-grow">
              {price.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', })}
            </div>
            {#if isCharging(price.start, price.end)}
              <BatteryCharging class="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all"/>
            {/if}
            <div class="flex-grow-0 font-semibold text-gray-900">{price.price.toFixed(1)}p</div>
          </div>
        {/each}
      </div>
    </ScrollArea>
  </CardContent>
</Card>



<style>
  /* Optional extra styling for mobile & aesthetics */
  div::-webkit-scrollbar {
    display: none;
  }
</style>
