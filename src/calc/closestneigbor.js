import { calculateLengths, calculatePathLength, getClosest } from "./utils";

export const closestNeighborSolve = (robotPosition, destinationPositions) => {
  const lookupTable = calculateLengths([{ ...robotPosition, index: -1 }, ...destinationPositions]);
  const indexOrder = [-1];

  indexOrder.push(getClosest(-1, lookupTable));

  while (indexOrder.length !== destinationPositions.length + 1) {
    const startIndex = indexOrder.at(-1);
    const excludeIndexes = indexOrder.slice(0, -1);
    const nextIndex = getClosest(startIndex, lookupTable, excludeIndexes)
    indexOrder.push(nextIndex);
  }

  const positions = indexOrder.slice(1).map((index) => destinationPositions.find((pos) => pos.index === index));

  return { 
    coords: [robotPosition, ...positions], 
    length: calculatePathLength(indexOrder, lookupTable),
    paths: destinationPositions.length
  };
}

self.onmessage = (event) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = closestNeighborSolve(robotPosition, destinationPositions);
  postMessage(result);
}

export default { closestNeighborSolve };
