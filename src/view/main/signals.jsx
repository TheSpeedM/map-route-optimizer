import { signal } from "@preact/signals-react";

const blocksize  = signal(100);
const mapSize = signal({});

// Used for displaying
const destinations = signal([]);
const path = signal([]);

// Used for calculation
const robotPosition = signal({ x: 0, y: 0 });
const destinationPosition = signal([]); // {x, y, index}

export { blocksize, mapSize, destinations, path, robotPosition, destinationPosition };
