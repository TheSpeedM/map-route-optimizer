import {
  getMinimumValue,
  calculateLengths,
  calculatePathLength,
  findMultipleClosest,
} from "./utils";

import {
  Position,
  DestinationPosition,
  LookAheadWorkerMessage,
  AlgorithmReturnMessage,
} from "../utils/types";

const LOOKAHEAD = 3;
const SPREAD = 3;

const expandPaths = (paths: number[][], spread: number, lookupTable: any) => {
  const newPaths: number[][] = [];

  paths.forEach((path) => {
    const startIndex = path.at(-1) ?? -1;
    const excludeIndexes = path.slice(0, -1);

    const closestNext = findMultipleClosest(
      startIndex,
      spread,
      lookupTable,
      excludeIndexes
    );

    closestNext.forEach((index: number) => {
      newPaths.push([...path, index]);
    });
  });

  return newPaths;
};

export const lookAheadSolve = (
  robotPosition: Position,
  destinationPositions: DestinationPosition[],
  lookahead = LOOKAHEAD,
  spread = SPREAD
): AlgorithmReturnMessage => {
  if (destinationPositions.length === 0)
    throw new Error("No destinations given");

  const lookupTable = calculateLengths([
    { ...robotPosition, index: -1 },
    ...destinationPositions,
  ]);

  const indexOrder = [-1];
  let pathsSearched = 0;

  while (indexOrder.length !== destinationPositions.length) {
    let paths = [indexOrder];

    for (let i = 0; i < lookahead; i++) {
      const expandedPaths = expandPaths(paths, spread, lookupTable);
      if (expandedPaths.length === 0) break;

      paths = expandedPaths;
    }

    pathsSearched += paths.length;

    const pathLengths = paths.map((path) =>
      calculatePathLength(path, lookupTable)
    );

    const minLength = getMinimumValue(pathLengths);
    const minPathIndex = pathLengths.findIndex((value) => value === minLength);
    const shortestPath = paths[minPathIndex];

    if (shortestPath.length === destinationPositions.length + 1) {
      if (indexOrder.length === 1) {
        // Meaning nothing has been pushed yet
        indexOrder.push(...shortestPath.slice(1));
        break;
      }

      indexOrder.push(...shortestPath.slice(-lookahead));
      break;
    }

    indexOrder.push(shortestPath[indexOrder.length]);
  }

  const positions = indexOrder.slice(1).map((index) => {
    const destinationPos = destinationPositions.find(
      (pos) => pos.index === index
    );

    if (!destinationPos) throw new Error("No destination found");
    return destinationPos;
  });

  return {
    coords: [robotPosition, ...positions],
    length: calculatePathLength(indexOrder, lookupTable),
    paths: pathsSearched,
  };
};

self.onmessage = (event: LookAheadWorkerMessage) => {
  const { robotPosition, destinationPositions, lookahead, spread } = event.data;

  const result = lookAheadSolve(
    robotPosition,
    destinationPositions,
    lookahead,
    spread
  );

  postMessage(result);
};

export default { lookAheadSolve };
