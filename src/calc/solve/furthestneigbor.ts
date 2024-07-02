import { closestNeighborSolve } from "./closestneigbor";

import {
  Position,
  DestinationPosition,
  SolverWorkerMessage,
  SolverReturnMessage,
} from "../../utils/types";

export const furthestNeighborSolve = (
  robotPosition: Position,
  destinationPositions: DestinationPosition[]
): SolverReturnMessage => {
  if (destinationPositions.length === 0)
    throw new Error("No destinations given");

  const closestResult = closestNeighborSolve(
    robotPosition,
    destinationPositions
  );

  const furthestPoint = closestResult.coords.at(-1);

  if (!furthestPoint) throw new Error("No furthest point found");

  const reverseResult = closestNeighborSolve(
    furthestPoint,
    closestResult.coords.slice(0, -1) as DestinationPosition[]
  );

  return { ...reverseResult, paths: 2 };
};

self.onmessage = (event: SolverWorkerMessage) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = furthestNeighborSolve(robotPosition, destinationPositions);
  postMessage(result);
};

export default { furthestNeighborSolve };
