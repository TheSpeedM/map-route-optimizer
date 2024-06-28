import { calculateLengths, calculatePathLength, getClosest } from "./utils";

export const closestNeighborSolve = (robotPosition, destinationPositions) => {
  const newRobotPosition = robotPosition?.index ? robotPosition : {...robotPosition, index: -1}
  const lookupTable = calculateLengths([newRobotPosition, ...destinationPositions]);
  const indexOrder = [newRobotPosition.index];

  indexOrder.push(getClosest(indexOrder.at(0), lookupTable));

  while (indexOrder.length !== destinationPositions.length + 1) {
    const startIndex = indexOrder.at(-1);
    const excludeIndexes = indexOrder.slice(0, -1);
    const nextIndex = getClosest(startIndex, lookupTable, excludeIndexes)
    indexOrder.push(nextIndex);
  }

  const positions = indexOrder.slice(1).map((index) => destinationPositions.find((pos) => pos.index === index));

  return { 
    coords: [newRobotPosition, ...positions], 
    length: calculatePathLength(indexOrder, lookupTable),
    paths: 1
  };
}

self.onmessage = (event) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = closestNeighborSolve(robotPosition, destinationPositions);
  postMessage(result);
}

export default { closestNeighborSolve };
