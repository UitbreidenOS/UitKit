# SVG Inspector Bootcamp

4-week intensive training program covering SVG fundamentals, interactive visualization, codebase integration, and capstone project delivery.

---

## Program Overview

| Week | Focus | Hours | Deliverable |
|------|-------|-------|-------------|
| 1 | SVG Fundamentals & DOM API | 12 | SVG anatomy quiz + shape showcase |
| 2 | Interactive Visualization | 14 | Dynamic chart component |
| 3 | Codebase Integration | 16 | Inspector plugin prototype |
| 4 | Capstone Project | 20 | Production-ready visualization tool |

**Live Sessions:** Thursday 6pm PT, 90 minutes each (optional recordings available)

---

## Week 1: SVG Fundamentals & DOM API

### Learning Objectives
- Understand SVG coordinate system and viewport sizing
- Build shapes using `<path>`, `<circle>`, `<rect>`, `<polygon>`
- Manipulate SVG elements via JavaScript DOM API
- Use transforms: `translate`, `scale`, `rotate`, `skew`
- Apply filters, gradients, and clipping paths

### Curriculum

#### Day 1: SVG Anatomy (3 hours)
- SVG vs Canvas vs HTML5 Graphics
- Coordinate system (origin, units, viewBox)
- Viewport sizing: `width`, `height`, `viewBox`, `preserveAspectRatio`
- Rendering order and `z-index` with `<g>` groups
- **Exercise:** Build a simple house using shapes

```svg
<svg viewBox="0 0 200 200" width="200" height="200">
  <!-- House -->
  <rect x="50" y="80" width="100" height="80" fill="#8B4513"/>
  <polygon points="50,80 150,80 100,30" fill="#D2691E"/>
  <circle cx="75" cy="110" r="8" fill="#FFD700"/>
  <rect x="120" y="100" width="20" height="30" fill="#87CEEB"/>
</svg>
```

#### Day 2: Paths & Advanced Shapes (3 hours)
- Path `d` attribute: M (move), L (line), C (cubic bezier), Q (quadratic), A (arc), Z (close)
- String-based path construction
- Path animation and manipulation
- Common path patterns (curves, waves, custom shapes)
- **Exercise:** Draw a sine wave using quadratic curves

```svg
<path d="M10,50 Q30,10 50,50 T90,50 T130,50 T170,50" 
      stroke="blue" fill="none" stroke-width="2"/>
```

#### Day 3: DOM Manipulation & Transforms (3 hours)
- Creating/modifying SVG elements with `document.createElementNS()`
- Attribute manipulation: `setAttribute`, `getAttribute`
- Transform functions: `translate()`, `scale()`, `rotate()`, `skewX()`, `skewY()`
- Transform origin and composition
- **Exercise:** Create animated rotating star

```javascript
const svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
svg.setAttribute("cx", "100");
svg.setAttribute("cy", "100");
svg.setAttribute("r", "50");
svg.setAttribute("fill", "blue");
svg.setAttribute("transform", "rotate(45 100 100)");
```

#### Day 4: Styles, Filters & Gradients (3 hours)
- Inline styles vs `<style>` blocks
- Linear and radial gradients
- SVG filters: `<feGaussianBlur>`, `<feOffset>`, `<feBlend>`, `<feColorMatrix>`
- Clipping paths and masking
- **Exercise:** Create gradient backdrop with blur filter

```svg
<defs>
  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
    <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
  </linearGradient>
  <filter id="blur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
  </filter>
</defs>
<rect x="0" y="0" width="200" height="200" fill="url(#grad1)" filter="url(#blur)"/>
```

### Live Session (Thursday 6pm PT)
**"SVG Under the Hood"** — Q&A, debugging common rendering issues, live coding a custom shape component

### Weekly Assignment
**Deliverable:** SVG Anatomy Quiz (20 questions) + Showcase app with 10+ shapes
- Submit via GitHub repo link
- Include screenshot and inline documentation
- Graded on: correctness, clarity, code style

---

## Week 2: Interactive Visualization

### Learning Objectives
- Bind data to SVG elements (D3-like patterns)
- Implement mouse events: `mouseover`, `click`, `drag`
- Build animated transitions and easing
- Create interactive charts (line, bar, scatter)
- Optimize performance for large datasets

### Curriculum

#### Day 1: Event Handling & Interactivity (3 hours)
- Event listeners: `addEventListener`, delegation
- Mouse events: `mouseenter`, `mouseleave`, `click`, `dblclick`
- Drag and drop: `mousedown`, `mousemove`, `mouseup`
- Touch events for mobile: `touchstart`, `touchmove`, `touchend`
- **Exercise:** Create draggable circles

```javascript
let isDragging = false;
const circle = document.querySelector('circle');

circle.addEventListener('mousedown', () => {
  isDragging = true;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    circle.setAttribute('cx', e.clientX);
    circle.setAttribute('cy', e.clientY);
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
```

#### Day 2: Data Binding & D3 Patterns (3 hours)
- Data-driven DOM updates: map data arrays to SVG elements
- Selection patterns and `.data()` / `.enter()` / `.exit()`
- Scaling functions: linear, logarithmic, ordinal
- Axes and labels for charts
- **Exercise:** Build a bar chart from array data

```javascript
const data = [10, 25, 15, 30, 20];
const width = 500, height = 300;
const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const scale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, height]);

svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => i * (width / data.length))
  .attr('y', d => height - scale(d))
  .attr('width', width / data.length - 2)
  .attr('height', d => scale(d));
```

#### Day 3: Animations & Transitions (3 hours)
- CSS animations on SVG elements
- SVG `<animate>` and `<animateTransform>` elements
- JavaScript requestAnimationFrame for smooth motion
- Easing functions: linear, ease-in, ease-out, cubic-bezier
- Transition chaining and callbacks
- **Exercise:** Animate bar chart on load

```html
<animate attributeName="height" from="0" to="100" dur="1s" begin="0s"/>
<animateTransform attributeName="transform" type="rotate" 
                   from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite"/>
```

```javascript
d3.selectAll('rect')
  .transition()
  .duration(1000)
  .ease(d3.easeCubicInOut)
  .attr('y', d => height - scale(d));
```

#### Day 4: Chart Types & Performance (3 hours)
- Line charts: path interpolation (linear, cardinal, monotone)
- Scatter plots with encoding (size, color)
- Pie charts and donut charts
- Performance: limits (~5000 DOM elements), debouncing resize
- Canvas fallback for large datasets
- **Exercise:** Multi-dataset line chart with legend

### Live Session (Thursday 6pm PT)
**"Making Charts Interactive"** — Responsive behavior, tooltip implementation, live demo of animation performance

### Weekly Assignment
**Deliverable:** Dynamic Chart Component (React/Vue/Vanilla JS)
- Accept dataset as input
- Support 3+ chart types (line, bar, scatter)
- Include tooltips on hover
- Responsive to window resize
- Submit code + live demo (CodePen/Stackblitz)

---

## Week 3: Integration with Codebase Tools

### Learning Objectives
- Understand Claudient's CliApp SVG inspector architecture
- Build interactive inspection tools
- Integrate with clipboard and file I/O APIs
- Parse and visualize structured data (JSON, tree formats)
- Create reusable inspector plugins

### Curriculum

#### Day 1: CliApp Architecture Review (3 hours)
- Claudient codebase structure: `site/src/components/os/apps/`
- CliApp component lifecycle and event handling
- SVG rendering within React components
- State management for interactive tools
- **Exercise:** Analyze existing CliApp implementations

**Reference file:** `/Users/tushar/Desktop/Claudient/site/src/components/os/apps/CliApp.tsx`

#### Day 2: Building Inspector Components (4 hours)
- Parse CLI commands and output
- Render command structure as SVG tree
- Node selection and traversal
- Export/copy visualization
- Theme integration (dark/light mode)
- **Exercise:** Build a simple JSON tree inspector

```typescript
interface TreeNode {
  label: string;
  value?: any;
  children?: TreeNode[];
}

const renderTree = (node: TreeNode, x: number, y: number, svg: SVGElement) => {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x.toString());
  circle.setAttribute('cy', y.toString());
  circle.setAttribute('r', '8');
  circle.setAttribute('fill', 'var(--accent-color)');
  svg.appendChild(circle);

  node.children?.forEach((child, i) => {
    const childX = x + (i - node.children.length / 2) * 60;
    const childY = y + 50;
    // Draw line to child
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x.toString());
    line.setAttribute('y1', y.toString());
    line.setAttribute('x2', childX.toString());
    line.setAttribute('y2', childY.toString());
    svg.appendChild(line);
    renderTree(child, childX, childY, svg);
  });
};
```

#### Day 3: Plugin Architecture (4 hours)
- Define plugin interface (metadata, renderer, event handlers)
- Hook system for extending CliApp
- Configuration schemas
- Plugin loading and registration
- Error handling and fallbacks
- **Exercise:** Create a reusable pie chart inspector plugin

```typescript
interface InspectorPlugin {
  id: string;
  name: string;
  description: string;
  render: (data: any, container: SVGElement) => void;
  onDataChange?: (data: any) => void;
  supports: (dataType: string) => boolean;
}

const pieChartPlugin: InspectorPlugin = {
  id: 'pie-chart',
  name: 'Pie Chart Inspector',
  description: 'Visualize categorical data as pie charts',
  supports: (type) => type === 'object',
  render: (data, container) => {
    // Implementation
  }
};
```

#### Day 4: Advanced Integration (5 hours)
- Keyboard shortcuts for navigation
- Undo/redo for inspector state
- Clipboard API for copy/paste
- Export as PNG/SVG
- Real-time streaming data visualization
- **Exercise:** Implement copy-to-clipboard for selected nodes

### Live Session (Thursday 6pm PT)
**"Extending Claudient"** — Plugin architecture deep dive, demo custom inspector, Q&A on integration patterns

### Weekly Assignment
**Deliverable:** Inspector Plugin Prototype
- Choose one data type (JSON tree, CLI output, dependency graph, etc.)
- Implement full plugin interface
- Include documentation (usage, configuration, examples)
- Submit to `plugins/` directory with PR
- Include screenshot and demo

---

## Week 4: Capstone Project

### Learning Objectives
- Apply all concepts to production-quality tool
- Handle edge cases and user feedback
- Optimize performance and accessibility
- Document and test thoroughly
- Present and defend design decisions

### Curriculum

#### Day 1: Capstone Planning & Design (4 hours)
- Choose capstone project (see options below)
- Define user stories and acceptance criteria
- Sketch wireframes and interaction patterns
- Plan data structures and algorithms
- Review peer proposals in live session

**Capstone Project Options:**

1. **SVG-Based Project Dependencies Graph**
   - Visualize npm/yarn dependency trees
   - Interactive zoom, pan, search
   - Show conflicts and version mismatches
   - Export as report

2. **SQL Query Visualizer**
   - Parse SQL, visualize as query plan
   - Show table joins, filters, aggregations
   - Interactive performance analysis
   - Explain query optimization

3. **Code Coverage Heat Map**
   - Visualize file/function coverage
   - Interactive drill-down by module
   - Commit history overlay
   - Export as badge

4. **Network Traffic Analyzer**
   - Visualize HTTP requests/responses
   - Show latency, payload size, dependencies
   - Timeline scrubber
   - Filter by status, type, domain

5. **Component Hierarchy Inspector** (Claudient-specific)
   - Visualize React component tree
   - Show props, state, event flow
   - Performance profiling overlay
   - Export architecture diagrams

#### Day 2-3: Development Sprint (8 hours)
- Implement core visualization logic
- Build interactive features (filters, search, export)
- Add error handling and edge cases
- Implement responsive design
- Write unit tests for logic functions
- **Checkpoint:** Mid-project review with instructor feedback

#### Day 4: Polish & Presentation (4 hours)
- Performance optimization and profiling
- Accessibility audit (ARIA labels, keyboard nav)
- Write user documentation
- Prepare 10-minute demo presentation
- Practice Q&A responses
- **Live Session:** Capstone presentations and peer feedback

### Capstone Rubric (100 points)

| Criterion | Points | Details |
|-----------|--------|---------|
| **Functionality** | 25 | Core features work; handles edge cases |
| **Interactivity** | 20 | Smooth animations, responsive controls, good UX |
| **Code Quality** | 15 | Clean, modular, well-documented, DRY |
| **Testing** | 15 | Unit tests, edge case coverage, error handling |
| **Presentation** | 15 | Clear demo, thoughtful design decisions, answers |
| **Polish** | 10 | Accessibility, performance, visual design |

### Final Deliverables
1. **Source Code** — GitHub repo with clean commit history
2. **Documentation** — README with setup, usage, architecture
3. **Demo Video** — 10-minute walkthrough (screencast)
4. **Test Suite** — Jest/Vitest with >80% coverage
5. **Live Demo** — Deployed to Vercel or similar
6. **Presentation Slides** — Design decisions and learnings

---

## Live Session Schedule

### Week 1 (Thu 6pm PT): SVG Under the Hood
- 15 min: Q&A on coordinate systems and viewBox
- 30 min: Live coding — building a parametric shape generator
- 30 min: Debugging common SVG rendering issues
- 15 min: Preview of Week 2

### Week 2 (Thu 6pm PT): Making Charts Interactive
- 20 min: Performance patterns for large datasets
- 40 min: Live coding — tooltip system with D3
- 20 min: Animation smoothness and easing strategies
- 10 min: Assignment Q&A

### Week 3 (Thu 6pm PT): Extending Claudient
- 20 min: Plugin architecture walkthrough
- 40 min: Live plugin development (pair programming)
- 20 min: Integration patterns and gotchas
- 10 min: Capstone project brainstorm

### Week 4 (Thu 6pm PT): Capstone Showcase
- 50 min: Student presentations (5 × 10 min)
- 20 min: Peer feedback discussion
- 20 min: Course retrospective and resources

---

## Prerequisites & Setup

### Required Knowledge
- JavaScript ES6+ (arrow functions, destructuring, async/await)
- HTML/CSS fundamentals
- Basic React or vanilla DOM manipulation
- Git and GitHub

### Development Environment
```bash
# Clone Claudient
git clone https://github.com/tushar2704/Claudient.git
cd Claudient

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test
```

### Tools & Resources
- **IDE:** VS Code with SVG extension
- **Browser DevTools:** Chrome/Firefox (inspect SVG, break on events)
- **Visualization Libraries:** D3.js, Visx, Recharts (reference implementations)
- **Testing:** Jest, React Testing Library

---

## Learning Resources

### Reference Documentation
- [MDN SVG Guide](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [D3.js Documentation](https://d3js.org)
- [SVG Filters by Example](https://www.w3.org/Graphics/SVG/svg-comparison.html)
- [Paths and Curves](https://cubic-bezier.com/)

### Recommended Reading
- "SVG Essentials" — J. David Eisenberg
- "Interactive Data Visualization" — Scott Murray
- Claudient architecture docs: `/docs/` in repo

### Example Projects
- `site/src/components/os/apps/` — CliApp reference implementations
- `examples/` — Sample inspectors and visualizations (if available)

---

## Grading & Certification

### Weekly Assignments (60%)
- Week 1: SVG Anatomy Quiz + Showcase (15%)
- Week 2: Dynamic Chart Component (15%)
- Week 3: Inspector Plugin Prototype (15%)
- Week 4: Capstone Project (15%)

### Live Participation (20%)
- Attendance and engagement in 4 live sessions
- Peer feedback contributions
- Q&A participation

### Capstone Presentation (20%)
- Demo quality and clarity
- Design decisions articulation
- Code quality and testing
- Ability to answer technical questions

### Certification
- **Pass** (70%+): "SVG Inspector Bootcamp Completion"
- **Distinction** (85%+): "SVG Inspector Bootcamp with Distinction"
- **Honor** (95%+): "SVG Inspector Bootcamp Honors"

Students receive signed digital certificate and GitHub badge.

---

## Support & Community

### Office Hours
- **Asynchronous:** Discord #bootcamp-support channel
- **Synchronous:** Optional 30-min slots after live sessions
- **Response SLA:** 24 hours for all questions

### Peer Learning
- **Study Groups:** Self-organize on Discord
- **Code Reviews:** Request peer feedback before submission
- **Showcase:** Celebrate projects in #showcase channel

### Instructors
- **Lead Instructor:** [Name/GitHub]
- **Teaching Assistant:** [Name/GitHub]
- **Community Moderator:** [Name/GitHub]

---

## Appendix: Common Patterns

### Pattern 1: D3-Style Data Binding
```javascript
const update = (data) => {
  const selection = d3.selectAll('circle').data(data);
  
  selection.enter()
    .append('circle')
    .merge(selection)
    .attr('cx', (d, i) => i * 50)
    .attr('cy', d => d.value);
    
  selection.exit().remove();
};
```

### Pattern 2: Draggable Elements
```javascript
const makeDraggable = (element) => {
  let offset = { x: 0, y: 0 };
  
  element.addEventListener('mousedown', (e) => {
    offset.x = e.clientX - element.getAttribute('x');
    offset.y = e.clientY - element.getAttribute('y');
  });
  
  document.addEventListener('mousemove', (e) => {
    element.setAttribute('x', e.clientX - offset.x);
    element.setAttribute('y', e.clientY - offset.y);
  });
};
```

### Pattern 3: SVG Text Measurement
```javascript
const measureText = (text, fontSize = 12) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textEl.textContent = text;
  textEl.setAttribute('font-size', fontSize);
  svg.appendChild(textEl);
  document.body.appendChild(svg);
  
  const bbox = textEl.getBBox();
  document.body.removeChild(svg);
  
  return { width: bbox.width, height: bbox.height };
};
```

### Pattern 4: Responsive SVG Viewbox
```javascript
const responsiveSVG = (container, width = 800, height = 600) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.style.width = '100%';
  svg.style.height = 'auto';
  
  container.appendChild(svg);
  return svg;
};
```

---

## Feedback & Iteration

This bootcamp is living documentation. After each cohort:
- Collect student feedback via anonymous survey
- Update curriculum based on common pain points
- Refresh examples with latest Claudient features
- Share learnings with community

**Last Updated:** 2026-06-22  
**Next Review:** After Cohort 1 completion
