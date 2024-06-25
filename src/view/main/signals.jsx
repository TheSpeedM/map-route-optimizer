import { signal } from "@preact/signals-react";

// Used for displaying
const destinations = signal([]);

// Used for calculation
const robotPosition = signal({ x: 0, y: 0 });
const destinationPosition = signal([]); // {x, y, index}

export { destinations, robotPosition, destinationPosition };
