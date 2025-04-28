<script lang="ts">
  import * as d3 from 'd3';

  const { displayPrices }: { displayPrices: { key: string, value: number }[] } = $props();

  const width = 600;
  const height = 600;
  const columns = 8;
  const boxWidth = width / columns;
  const boxHeight = 70;

  let svgEl: SVGSVGElement;
  let legendEl: SVGSVGElement;

  function getColor(value: number): string {
    if (value === 999) return "#ffffff"; // Explicit White
    if (value < 0) return "#a8c6f1";      // Pastel blue
    if (value < 5) return "#a0d8d1";       // Pastel teal
    if (value < 10) return "#d3f0d7";     // Pastel light green
    if (value < 15) return "#ffffe0";     // Pastel light yellow
    if (value < 20) return "#ffd8b1";     // Pastel peach
    if (value < 25) return "#ffb6b6";     // Pastel red
    return "#d1b3ff";                    // Pastel purple for high values
  }


  function getCurrentTimeBlock(): string {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const flooredMinute = minute >= 30 ? 30 : 0;
    return `${hour.toString().padStart(2, '0')}:${flooredMinute.toString().padStart(2, '0')}`;
  }

  let currentTimeBlock = getCurrentTimeBlock();

  const legendItems = [
    { label: "< 0", color: "#a8c6f1" },    // Pastel blue
    { label: "0–5", color: "#a0d8d1" },    // Pastel teal
    { label: "5–10", color: "#d3f0d7" },   // Pastel light green
    { label: "10–15", color: "#ffffe0" },  // Pastel light yellow
    { label: "15–20", color: "#ffd8b1" },  // Pastel peach
    { label: "20–25", color: "#ffb6b6" },  // Pastel red
    { label: "25–99", color: "#d1b3ff" },  // Pastel purple
  ];

  $effect(() => {
    if (!svgEl || displayPrices.length !== 48) return;

    const svg = d3.select(svgEl)
      .attr("width", width)
      .attr("height", boxHeight * Math.ceil(displayPrices.length / columns));

    svg.selectAll("*").remove();

    const group = svg.append("g");

    const cells = group.selectAll("g.cell")
      .data(displayPrices)
      .enter()
      .append("g")
      .attr("class", "cell")
      .attr("transform", (_, i) => {
        const x = (i % columns) * boxWidth;
        const y = Math.floor(i / columns) * boxHeight;
        return `translate(${x},${y})`;
      });

    cells.append("rect")
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .attr("fill", d => getColor(d.value))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    cells.append("text")
      .attr("class", "time")
      .text(d => d.key)
      .attr("x", boxWidth / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", d => d.key === currentTimeBlock ? "#ff00aa" : "#333"); // Bright pink

    cells.append("text")
      .attr("class", "value")
      .text(d => `${d.value.toFixed(1)}p`)
      .attr("x", boxWidth / 2)
      .attr("y", boxHeight / 2 + 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", d => d.key === currentTimeBlock ? "#ff00aa" : "#333"); // Bright pink
  });

  $effect(() => {
    if (!legendEl) return;

    const legendWidth = 600;
    const legendBoxSize = 20;

    const svg = d3.select(legendEl)
      .attr("width", legendWidth)
      .attr("height", 50);

    svg.selectAll("*").remove();

    const group = svg.append("g")
      .attr("transform", `translate(20,10)`);

    const item = group.selectAll("g.legend-item")
      .data(legendItems)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(${i * (legendBoxSize + 60)},0)`);

    item.append("rect")
      .attr("width", legendBoxSize)
      .attr("height", legendBoxSize)
      .attr("fill", d => d.color)
      .attr("stroke", "#000");

    item.append("text")
      .text(d => `${d.label}p`)
      .attr("x", legendBoxSize + 5)
      .attr("y", legendBoxSize / 2 + 4)
      .attr("font-size", "12px");
  });

  // 🔥 Auto-update the highlight every minute
  const interval = setInterval(() => {
    const newBlock = getCurrentTimeBlock();
    if (newBlock !== currentTimeBlock) {
      currentTimeBlock = newBlock;

      // Update the colors dynamically without re-rendering everything
      if (svgEl) {
        const svg = d3.select(svgEl);
        svg.selectAll("text.time")
          .attr("fill", d => d.key === currentTimeBlock ? "#ff00aa" : "#333");

        svg.selectAll("text.value")
          .attr("fill", d => d.key === currentTimeBlock ? "#ff00aa" : "#333");
      }
    }
  }, 30 * 1000); // Check every 30 seconds

  // cleanup interval if Svelte 5 supports onDestroy hook
</script>

<div style="text-align: center;">
  <svg bind:this={legendEl}></svg>
  <br />
  <svg bind:this={svgEl}></svg>
</div>

<style>
  svg {
    display: block;
    margin: auto;
    background: #f8f8f8;
  }
</style>
