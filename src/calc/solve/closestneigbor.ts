import { calculateLengths, calculatePathLength, getClosest } from "../utils";

import {
  Position,
  DestinationPosition,
  SolverWorkerMessage,
  SolverReturnMessage,
} from "../../utils/types";

export const closestNeighborSolve = (
  robotPosition: Position,
  destinationPositions: DestinationPosition[]
): SolverReturnMessage => {
  if (destinationPositions.length === 0)
    throw new Error("No destinations given");

  const newRobotPosition: DestinationPosition = {
    ...robotPosition,
    index: robotPosition?.index ?? -1,
  };

  const lookupTable = calculateLengths([
    newRobotPosition,
    ...destinationPositions,
  ]);

  const indexOrder = [newRobotPosition.index];
  const closest = getClosest(indexOrder[0], lookupTable);
  
  if (closest === null) throw new Error("No closest coordinate found")

  indexOrder.push(closest);

  while (indexOrder.length !== destinationPositions.length + 1) {
    const startIndex = indexOrder.at(-1);

    const excludeIndexes = indexOrder.slice(0, -1);
    const nextIndex = getClosest(startIndex ?? -1, lookupTable, excludeIndexes);

    if (nextIndex === null) break;

    indexOrder.push(nextIndex);
  }

  const positions = indexOrder.slice(1).map((index) => {
    const destinationPos = destinationPositions.find(
      (pos) => pos.index === index
    );

    if (!destinationPos) throw new Error("No destination found");
    return destinationPos;
  });

  return {
    coords: [newRobotPosition, ...positions],
    length: calculatePathLength(indexOrder, lookupTable),
    paths: 1,
  };
};

self.onmessage = (event: SolverWorkerMessage) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = closestNeighborSolve(robotPosition, destinationPositions);
  postMessage(result);
};

export default { closestNeighborSolve };
