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

  console.log(distances, minDistance)
  const lookupTableItem = lookupTable.find((item) => item[2] === minDistance);
  const nextItem = lookupTableItem.find((i) => i.index !== startIndex)
  return nextItem.index;
}

export const closestNeighbor = (robotPosition, destinationPositions) => {
  const lookupTable = calculateLengths([{ ...robotPosition, index: -1 }, ...destinationPositions]);
  const indexOrder = [-1];

  indexOrder.push(getClosest(-1, lookupTable));

  for (let i = 0; i < destinationPositions.length - 3; i++) {
    indexOrder.push(getClosest(indexOrder.slice(-1)[0], lookupTable, indexOrder.slice(0, -1)))
  }

  const indexes = destinationPositions.map((item) => item.index);
  indexOrder.push(
    indexes.find((i) => !indexOrder.includes(i))
  );

  const positions = indexOrder.slice(1).map((index) => destinationPositions.find((pos) => pos.index === index));

  return { coords: [robotPosition, ...positions], length: calculatePathLength(indexOrder, lookupTable) };


}

export default { closestNeighbor };
