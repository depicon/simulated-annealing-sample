# Simulated Annealing Timetable (Graph Coloring) Demo

A minimal React + TypeScript app (with Vite & TailwindCSS) that demonstrates the **simulated annealing algorithm** for solving a graph coloring challenge (e.g., lesson/timetable scheduling). Nodes are colored, and conflicts (two connected nodes with the same color) are minimized interactively.

## Features

- **Graph coloring simulation** using simulated annealing logic.
- Interactive SVG-based visualization of the graph:
  - Nodes colored by state (conflicts highlighted on edges).
  - Step-by-step and animated simulation controls.
- Add custom colors to the palette dynamically.
- Real-time logging (mutation info, deltaE, acceptance, etc.).
- UI in French.

## Demo

![screenshot](screenshot.png) <!-- Add an actual screenshot if possible -->

## How it works

- **Nodes:** Represent events/resources with (x,y) coordinates, colored for assignment.
- **Edges:** Represent conflicts—two connected nodes must have different colors.
- **Energy:** Number of edges where both ends have the same color (conflict).
- **Annealing Algorithm:** At each step, a random node tries a new color; if the overall energy (conflicts) rises, the change is sometimes accepted with probability `exp(-deltaE/temperature)`.
- **Temperature:** Decreases after each step, reducing the chance of making things "worse" over time.

The algorithm progresses toward a coloring with minimal (ideally zero) conflicts.

## Tech Stack

- **Frontend:** React 19 / TypeScript / Vite
- **Styling:** TailwindCSS (v4)
- **State & Logic:** React hooks (`useSimulatedAnnealing`) for running the algorithm and state management
- **SVG rendering** for the graph

## Getting Started

```bash
git clone https://github.com/depicon/simulated-annealing-sample.git
cd simulated-annealing-sample
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## File structure

- `src/App.tsx` – Main UI, controls, and display
- `src/hooks/useSimulatedAnnealing.ts` – Simulated annealing algorithm and state
- `src/components/GraphView.tsx` – SVG visual rendering of the graph

## Example: Algorithm excerpt

```typescript
const [temperature, setTemperature] = useState(10);
const coolingRate = 0.90;

const nextStep = useCallback(() => {
  // Random node chooses a new color
  // If energy drops, accept. Otherwise, accept with probability exp(-deltaE/temperature)
  // Reduce temperature each step
}, [nodes, edges, temperature, energy, colors]);
```

## Customization

- Change the initial graph, colors, or annealing parameters in `useSimulatedAnnealing.ts`.
- Update UI or add new controls in `App.tsx`.

## License

MIT

---

Made by [depicon](https://github.com/depicon)
