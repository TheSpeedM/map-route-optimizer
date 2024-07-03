import { signal, Signal } from "@preact/signals-react";

import {
  MapSize,
  Destination,
  Path,
  Position,
  DestinationPosition,
  Statistics,
} from "../../utils/types";

const blocksize: Signal<number> = signal(100);
const mapSize: Signal<MapSize> = signal({});

// Used for displaying
const destinations: Signal<Destination[]> = signal([]);
const path: Signal<Path[]> = signal([]);

// Used for calculation
const robotPosition: Signal<Position> = signal({ x: 0, y: 0 });
const destinationPosition: Signal<DestinationPosition[]> = signal([]);

const algorithmStats: Signal<[string, Statistics][]> = signal([])

const resetSignals = () => {
  path.value = [];
  algorithmStats.value = [];
};

export {
  blocksize,
  mapSize,
  destinations,
  path,
  robotPosition,
  destinationPosition,
  algorithmStats,
  resetSignals
};
