---
name: d3-data-visualization
description: "D3.js data visualization: interactive charts, graphs, maps, and dashboards using D3.js with responsive SVG design, data-driven document generation, and animation"
updated: 2026-06-13
---

# D3.js Data Visualization — Interactive Charts & Graphs

## When to activate
- Building interactive, data-driven visualizations (charts, graphs, maps, trees)
- Creating dashboards that need custom layouts beyond chart library defaults
- Animating data transitions (real-time updates, time-series playback)
- Building visualizations that need fine-grained control over every SVG element
- When standard chart libraries (Chart.js, Recharts) are too limiting
- Creating network graphs, force-directed layouts, or geographic maps

## When NOT to use
- Simple bar/line/pie charts where Chart.js or Recharts suffice
- Static images or server-rendered charts (use canvas/PNG generation)
- When the user just needs a quick plot for data exploration (use matplotlib/vega)
- Real-time streaming with 1000+ data points per second (use WebGL-based libs)

## Instructions

### 1. Chart Type Selection Guide

| Data Type | Best Chart | D3 Pattern |
|-----------|-----------|------------|
| Categorical comparison | Bar chart (horizontal/vertical) | `scaleBand()` + `scaleLinear()` |
| Time series | Line chart / Area chart | `scaleTime()` + `d3.line()` |
| Part-of-whole | Pie/Donut chart | `d3.pie()` + `d3.arc()` |
| Distribution | Histogram / Box plot | `d3.bin()` + custom SVG |
| Relationship | Scatter plot / Bubble chart | `scaleLinear()` × 2 |
| Hierarchy | Tree / Treemap / Sunburst | `d3.hierarchy()` + layout |
| Network | Force-directed graph | `d3.forceSimulation()` |
| Geographic | Choropleth / Point map | `d3.geoPath()` + TopoJSON |

### 2. Core Pattern — Enter/Update/Exit

```typescript
import * as d3 from 'd3';

interface DataPoint {
  label: string;
  value: number;
}

function renderBarChart(data: DataPoint[], container: string) {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)!])
    .range([height, 0]);

  // Axes
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .call(d3.axisLeft(y));

  // Bars — enter/update/exit pattern
  const bars = svg.selectAll('.bar')
    .data(data, (d: any) => d.label);

  bars.exit()
    .transition().duration(300)
    .attr('height', 0)
    .attr('y', height)
    .remove();

  bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.label)!)
    .attr('width', x.bandwidth())
    .attr('y', height)
    .attr('height', 0)
    .attr('fill', '#2563EB')
    .merge(bars as any)
    .transition().duration(500)
    .attr('x', d => x(d.label)!)
    .attr('width', x.bandwidth())
    .attr('y', d => y(d.value))
    .attr('height', d => height - y(d.value));
}
```

### 3. Responsive SVG

```typescript
function makeResponsive(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  // Use viewBox instead of fixed width/height
  svg.attr('viewBox', '0 0 600 400')
     .attr('preserveAspectRatio', 'xMidYMid meet')
     .style('width', '100%')
     .style('height', 'auto');

  // Optional: redraw on resize
  const resizeObserver = new ResizeObserver(() => {
    // Recalculate scales and redraw if needed
    svg.call(redraw);
  });
  
  resizeObserver.observe(svg.node()!.parentElement!);
}
```

### 4. Interactive Tooltips

```typescript
function addTooltip(svg: d3.Selection<any, any, any, any>) {
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0,0,0,0.8)')
    .style('color', 'white')
    .style('padding', '8px 12px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  svg.selectAll('.bar')
    .on('mouseover', (event, d: DataPoint) => {
      tooltip.transition().duration(200).style('opacity', 1);
      tooltip.html(`<strong>${d.label}</strong><br/>${d.value}`)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0);
    });
}
```

### 5. Animated Transitions

```typescript
// Smooth data update animation
function updateData(newData: DataPoint[]) {
  const t = d3.transition().duration(750).ease(d3.easeCubicInOut);
  
  // Update scales
  y.domain([0, d3.max(newData, d => d.value)!]);
  
  // Update axes with transition
  svg.select('.y-axis').transition(t as any).call(d3.axisLeft(y));
  
  // Update bars with transition
  svg.selectAll('.bar')
    .data(newData, (d: any) => d.label)
    .join(
      enter => enter.append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label)!)
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', '#2563EB')
        .call(enter => enter.transition(t)
          .attr('y', d => y(d.value))
          .attr('height', d => height - y(d.value))),
      update => update.call(update => update.transition(t)
        .attr('x', d => x(d.label)!)
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value))),
      exit => exit.call(exit => exit.transition(t)
        .attr('height', 0)
        .attr('y', height)
        .remove())
    );
}
```

### 6. Common Visualization Templates

**Time-series line chart:**
```typescript
const line = d3.line<DataPoint>()
  .x(d => xScale(new Date(d.label)))
  .y(d => yScale(d.value))
  .curve(d3.curveCatmullRom);  // smooth curves

svg.append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#2563EB')
  .attr('stroke-width', 2)
  .attr('d', line);
```

**Force-directed network graph:**
```typescript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
  .force('charge', d3.forceManyBody().strength(-200))
  .force('center', d3.forceCenter(width / 2, height / 2));
```

## Example

**Building an interactive revenue dashboard:**

```
User: "Create a D3 dashboard showing monthly revenue, user growth,
       and churn rate with interactive tooltips and animated transitions"

Agent generates:
1. SVG layout with 3 panels (grid layout)
2. Panel 1: Area chart — monthly revenue with gradient fill
3. Panel 2: Stacked bar chart — new vs returning users
4. Panel 3: Line chart — churn rate with threshold line at 5%
5. Shared time axis with brush for date range selection
6. Tooltips on hover showing exact values
7. Animated transitions when filtering by date range
8. Responsive viewBox that adapts to container width
```

## Anti-Patterns

- **No viewBox:** Using fixed pixel dimensions instead of viewBox — SVGs won't scale on mobile or resize with container
- **Direct DOM manipulation:** Using `document.querySelector` instead of D3 selections — breaks D3's data binding
- **Missing exit selection:** Not handling removed data in the update pattern — orphaned SVG elements accumulate
- **Expensive tooltips:** Creating a new tooltip div per element — reuse a single tooltip div and reposition it
- **Blocking the main thread:** Rendering 10,000+ points synchronously — use `requestAnimationFrame` or canvas for large datasets
- **Color accessibility:** Using only color to distinguish data series — always add patterns, labels, or shapes as secondary indicators
