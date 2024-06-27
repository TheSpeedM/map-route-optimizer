import { calculateLengths, calculatePathLength } from "./utils";

const getClosest = (startIndex, lookupTable, excludeIndexes = []) => {
  // Filter lookupTable to include only arrays that have an object with index === startIndex
  const hasStartIndex = lookupTable.filter((item) => (
    item.some((coord) => coord.index === startIndex)
  ));

  // Filter lookupTable to exclude arrays that have any object with index in excludeIndexes
  const filteredTable = hasStartIndex.filter((innerArray) => (
    !innerArray.some((coord) => excludeIndexes.includes(coord.index))
  ));

  const distances = filteredTable.map((item) => item[2]);
  const minDistance = Math.min(...distances);

  const lookupTableItem = filteredTable.find((item) => item[2] === minDistance);
  const nextItem = lookupTableItem.find((i) => i.index !== startIndex)
  return nextItem.index;
}

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

  return { coords: [robotPosition, ...positions], length: calculatePathLength(indexOrder, lookupTable) };
}

self.onmessage = (event) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = closestNeighborSolve(robotPosition, destinationPositions);
  postMessage(result);
}

export default { closestNeighborSolve };
