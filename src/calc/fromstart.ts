import {
  calculateLengths,
  findMultipleClosest,
  calculatePathLength,
} from "./utils";

import {
  Position,
  DestinationPosition,
  AlgorithmWorkerMessage,
  AlgorithmReturnMessage,
} from "../utils/types";

export const fromStartSolve = (
  robotPosition: Position,
  destinationPositions: DestinationPosition[]
): AlgorithmReturnMessage => {
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

  const indexOrder = [-1, ...findMultipleClosest(-1, Infinity, lookupTable)];
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

self.onmessage = (event: AlgorithmWorkerMessage) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = fromStartSolve(robotPosition, destinationPositions);
  postMessage(result);
};

export default { fromStartSolve };
