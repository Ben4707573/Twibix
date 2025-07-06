# Scramble Visualizers

This directory contains the visualizer components for different types of puzzles.

## CSTimer-based Visualizers

The CSTimer-based visualizers provide a representation similar to the original CSTimer:

- `cstimer/cube-visualizer.jsx` - CSTimer-style NxN cube visualizer (2x2 to 7x7)
- `cstimer/pyraminx-visualizer.jsx` - CSTimer-style Pyraminx visualizer
- `cstimer/draw-utils.js` - Common drawing utilities adapted from CSTimer

These visualizers are based on the original code from [CSTimer](https://github.com/cs0x7f/cstimer), 
with attribution provided in each component.

## Legacy Visualizers

These are the original visualizers, still used as fallbacks for some puzzle types:

- `cube-scrambler.jsx` - Original NxN cube visualizer
- `pyraminx-scrambler.jsx` - Original Pyraminx visualizer

## Usage

These components should not be imported directly. Instead, use the `UnifiedScrambleVisualizer` component
in the parent directory, which will automatically select the appropriate visualizer based on the cube type.

```jsx
import { UnifiedScrambleVisualizer } from "@/components/unified-scramble-visualizer";

// In your component
<UnifiedScrambleVisualizer scramble={scramble} cubeType={cubeType} />
```

The `UnifiedScrambleVisualizer` will only display visualizers for supported cube types (2x2 through 7x7 and Pyraminx).
For other puzzle types, it will display a message indicating that visualization is not available.

## Attributions

The CSTimer visualizers are based on code from the [CSTimer](https://github.com/cs0x7f/cstimer) project,
particularly from these files:
- https://github.com/cs0x7f/cstimer/blob/main/src/js/tools/image.js
- https://github.com/cs0x7f/cstimer/blob/main/src/js/scramble/pyraminx.js

Each CSTimer-based visualizer component includes an attribution link to the original project.
