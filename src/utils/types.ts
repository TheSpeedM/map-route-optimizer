export interface MapSize {
  width?: number;
  height?: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Vector {
  start: Coordinate;
  end: Coordinate;
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

export type AnyPosition = Position | DestinationPosition;

interface SolverWorkerData {
  robotPosition: Position;
  destinationPositions: DestinationPosition[];
}

interface LookAheadWorkerData extends SolverWorkerData {
  lookahead?: number;
  spread?: number;
}

interface RandomGuessesWorkerData extends SolverWorkerData {
  guesses: number;
}

export interface SolverWorkerMessage extends Event {
  data: SolverWorkerData;
}

export interface LookAheadWorkerMessage extends Event {
  data: LookAheadWorkerData;
}

export interface RandomGuessesWorkerMessage extends Event {
  data: RandomGuessesWorkerData;
}

export interface SolverReturnMessage {
  coords: AnyPosition[];
  length: number;
  paths: number;
}

interface OptimizerWorkerData {
  coords: AnyPosition[];
}

export interface OptimizerWorkerMessage extends Event {
  data: OptimizerWorkerData;
}

export interface OptimizerReturnMessage extends SolverReturnMessage {}
