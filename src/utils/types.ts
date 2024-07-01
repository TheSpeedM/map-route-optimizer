export interface MapSize {
  width?: number;
  height?: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Destination extends Coordinate, MapSize {
  index: number;
}

export interface Path extends Coordinate {
  index: number;
}

export interface Position extends Coordinate {
  index?: number;
}

export interface DestinationPosition extends Position {
  index: number;
}

export type NodeLength = [DestinationPosition, DestinationPosition, number];

interface AlgorithmWorkerData {
  robotPosition: Position;
  destinationPositions: DestinationPosition[];
}

interface LookAheadWorkerData extends AlgorithmWorkerData {
  lookahead: number;
  spread: number;
}

interface RandomGuessesWorkerData extends AlgorithmWorkerData {
  guesses: number;
}

export interface AlgorithmWorkerMessage extends Event {
  data: AlgorithmWorkerData;
}

export interface LookAheadWorkerMessage extends Event {
  data: LookAheadWorkerData;
}

export interface RandomGuessesWorkerMessage extends Event {
  data: RandomGuessesWorkerData;
}

export interface AlgorithmReturnMessage {
  coords: (Position | DestinationPosition)[];
  length: number;
  paths: number;
}
