import { closestNeighborSolve } from "./closestneigbor";

export const furthestNeighborSolve = (robotPosition, destinationPositions) => {
  const closestResult = closestNeighborSolve(robotPosition, destinationPositions);
  const furthestPoint = closestResult.coords.at(-1);

  const reverseResult = closestNeighborSolve(furthestPoint, closestResult.coords.slice(0, -1));
  return reverseResult
}

self.onmessage = (event) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = furthestNeighborSolve(robotPosition, destinationPositions);
  postMessage(result);
}

export default { furthestNeighborSolve };
