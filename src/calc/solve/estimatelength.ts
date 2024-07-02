import {
  getMinimumValue,
  calculateLengths,
  calculatePathLength,
  expandPaths,
} from "../utils";

import {
  Position,
  DestinationPosition,
  LookAheadWorkerMessage,
  SolverReturnMessage,
  NodeLength,
} from "../../utils/types";

const LOOKAHEAD = 3;
const SPREAD = 3;

const estimatePathLength = (
  indexOrder: number[],
  lookupTable: NodeLength[]
): number => {
  const currentLength = calculatePathLength(indexOrder, lookupTable);

  const allIndexes: Set<number> = new Set();

  lookupTable.forEach((item) => {
    allIndexes.add(item[0].index);
    allIndexes.add(item[1].index);
  });

  if (indexOrder.length === allIndexes.size) return currentLength;

  const allLengths = lookupTable.map((item) => item[2]);
  const totalLength = allLengths.reduce((partialSum, a) => partialSum + a, 0);

  const indexLenghts = lookupTable.map((item) =>
    indexOrder.includes(item[0].index) && indexOrder.includes(item[1].index)
      ? item[2]
      : 0
  );

  const indexLength = indexLenghts.reduce((partialSum, a) => partialSum + a, 0);

  const lengthEstimation = currentLength * (totalLength / indexLength);

  // console.log(
  //   Math.round(currentLength),
  //   "* (",
  //   Math.round(totalLength),
  //   "/",
  //   Math.round(indexLength),
  //   ") =",
  //   lengthEstimation
  // );

  return lengthEstimation;
};

export const estimateLengthSolve = (
  robotPosition: Position,
  destinationPositions: DestinationPosition[],
  lookahead = LOOKAHEAD,
  spread = SPREAD
): SolverReturnMessage => {
  if (destinationPositions.length === 0)
    throw new Error("No destinations given");

  const lookupTable = calculateLengths([
    { ...robotPosition, index: -1 },
    ...destinationPositions,
  ]);

  const indexOrder = [-1];
  let pathsSearched = 0;

  while (indexOrder.length !== destinationPositions.length + 1) {
    let paths = [indexOrder];

    for (let i = 0; i < lookahead; i++) {
      const expandedPaths = expandPaths(paths, spread, lookupTable);
      if (expandedPaths.length === 0) break;

      paths = expandedPaths;
    }

    pathsSearched += paths.length;

    const pathLengths = paths.map((path) =>
      estimatePathLength(path, lookupTable)
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

  const result = estimateLengthSolve(
    robotPosition,
    destinationPositions,
    lookahead,
    spread
  );

  postMessage(result);
};

export default { estimateLengthSolve };
