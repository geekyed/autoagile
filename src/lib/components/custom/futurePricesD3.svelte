<script lang="ts">
  import * as d3 from "d3";

  const { prices, carChargeTimespans }: { prices: Price[]; carChargeTimespans: AndersenChargeTimespan[] } = $props();

  const width = 574;
  const rowHeight = 40;
  const barWidth = 5;

  function getColor(value: number): string {
    if (value === 999) return "#ffffff";
    if (value < 0) return "#d1b3ff";
    if (value < 5) return "#a8c6f1";
    if (value < 10) return "#a0d8d1";
    if (value < 15) return "#d3f0d7";
    if (value < 20) return "#ffffe0";
    if (value < 25) return "#ffd8b1";
    return "#ffb6b6";
  }

  let svgEl: SVGSVGElement;

  $effect(() => {
    if (!svgEl || prices.length === 0) return;

    const sorted = [...prices].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const totalHeight = sorted.length * rowHeight;

    const svg = d3.select(svgEl)
      .attr("width", width)
      .attr("height", totalHeight);

    svg.selectAll("*").remove();

    const group = svg.append("g").attr("transform", "translate(0,0)");

    const cells = group.selectAll("g.cell")
      .data(sorted)
      .enter()
      .append("g")
      .attr("class", "cell")
      .attr("transform", (_, i) => `translate(0,${i * rowHeight})`);

    cells.each(function (d) {
      const g = d3.select(this);

      // Background rectangle
      g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", rowHeight)
        .attr("fill", getColor(d.price))

      const priceStart = d.start.getTime();
      const priceEnd = d.end.getTime();

      const isCharging = carChargeTimespans.some((span) => {
        return span.startTime.getTime() <= priceStart && span.endTime.getTime() >= priceEnd;
      });

      function darkenColor(hex: string, factor: number = 0.7): string {
        const c = d3.color(hex);
        if (c && "r" in c && "g" in c && "b" in c) {
          const { r, g, b } = c;
          return d3.rgb(r * factor, g * factor, b * factor).formatHex();
        }
        return hex; // fallback if invalid color
      }

      if (isCharging) {
        g.append("rect")
          .attr("x", 240)
          .attr("y", 0)
          .attr("width", barWidth)
          .attr("height", rowHeight)
          .attr("fill", darkenColor(getColor(d.price)))
      }


      // Time label (LEFT)
      const timeText = new Date(d.start).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      g.append("text")
        .text(timeText)
        .attr("x", 8)
        .attr("y", rowHeight / 2 + 5)
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .attr("fill", "#333");

      // Price label (CENTER)
      g.append("text")
        .text(`${d.price.toFixed(1)}p`)
        .attr("x", width-30)
        .attr("y", rowHeight / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333");
    });
  });
</script>

<div style="text-align: center;">
  <svg bind:this={svgEl}></svg>
</div>

<style>
  svg {
    display: block;
    margin: auto;
    background: #f8f8f8;
  }
</style>
