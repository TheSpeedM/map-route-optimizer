import { calculateLengths, findMultipleClosest, calculatePathLength } from "./utils";

export const fromStartSolve = (robotPosition, destinationPositions) => {
  const newRobotPosition = robotPosition?.index ? robotPosition : {...robotPosition, index: -1}
  const lookupTable = calculateLengths([newRobotPosition, ...destinationPositions]);
  const indexOrder = [-1, ...findMultipleClosest(-1, Infinity, lookupTable)];
  const positions = indexOrder.slice(1).map((index) => destinationPositions.find((pos) => pos.index === index));

  return {
    coords: [newRobotPosition, ...positions], 
    length: calculatePathLength(indexOrder, lookupTable),
    paths: 1
  };

}

self.onmessage = (event) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = fromStartSolve(robotPosition, destinationPositions);
  postMessage(result);
}

export default { fromStartSolve };
