# Map Route Optimizer

A playground for the traveling salesman problem made with React and Konva.

## Implemented algorithms

A brief summary of implemented algorithms:
- Brute force search: searches every possible combination for the shortest path.
- Closest neighbor search: looks for the closest node and picks that one.
- Furthest neighbor search: does a closest neighbor search and then does a closest neighbor search starting from the furthest node.
- Closest from start search: orders nodes only based on their distance from start.

- Optimistic brute force search: does a bruteforce search for the full path with limited spread per node.
- Limited lookahead search: looks a certain amound of nodes ahead, with a limited spread, and picks the shortest path.

## Run instructions
This project uses Bun. The development server can be started by running `bun install` and `bun run dev`.
