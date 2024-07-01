import { Coordinate, DestinationPosition, NodeLength } from "../utils/types";

export const getMinimumValue = (valueList: number[]) => {
  let minValue = Infinity;

  valueList.forEach((value) => {
    if (value < minValue) minValue = value;
  });

  return minValue;
};

export const calculateDistance = (a: Coordinate, b: Coordinate) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export const calculateLengths = (
  nodes: DestinationPosition[]
): NodeLength[] => {
  const results: NodeLength[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      results.push([nodes[i], nodes[j], calculateDistance(nodes[i], nodes[j])]);
    }
  }

  return results;
};

export const calculatePathLength = (
  indexOrder: number[],
  lookupTable: NodeLength[]
) => {
  let cumulativeLength = 0.0;

  for (let i = 1; i < indexOrder.length; i++) {
    const lookupTableItem = lookupTable.find(
      (item) =>
        (item[0].index === indexOrder[i] &&
          item[1].index === indexOrder[i - 1]) ||
        (item[1].index === indexOrder[i] && item[0].index === indexOrder[i - 1])
    );

    cumulativeLength += lookupTableItem ? lookupTableItem[2] : Infinity;
  }

  return cumulativeLength;
};

export const getClosest = (
  startIndex: number,
  lookupTable: NodeLength[],
  excludeIndexes: number[] = []
): number | null => {
  // Filter lookupTable to include only arrays that have an object with index === startIndex
  const hasStartIndex = lookupTable.filter((item) =>
    [item[0], item[1]].some((coord) => coord?.index === startIndex)
  );

  // Filter lookupTable to exclude arrays that have any object with index in excludeIndexes
  const filteredTable = hasStartIndex.filter(
    (innerArray) =>
      ![innerArray[0], innerArray[1]].some((coord) =>
        excludeIndexes.includes(coord.index)
      )
  );

  if (filteredTable.length === 0) return null;

  const distances = filteredTable.map((item) => item[2]);
  const minDistance = getMinimumValue(distances);

  const lookupTableItem = filteredTable.find((item) => item[2] === minDistance);

  if (!lookupTableItem)
    throw new Error(`Can't find item with length ${minDistance}`);

  const nextItem = [lookupTableItem[0], lookupTableItem[1]].find(
    (i) => i.index !== startIndex
  );

  if (!nextItem) throw new Error("Can't find next item");
  return nextItem.index;
};

export const findMultipleClosest = (
  startIndex: number,
  amount: number,
  lookupTable: NodeLength[],
  excludeIndexes: number[] = []
) => {
  const closestValues = [];
  while (closestValues.length < amount) {
    const closestValue = getClosest(startIndex, lookupTable, [
      ...excludeIndexes,
      ...closestValues,
    ]);

    if (closestValue === null) break;
    closestValues.push(closestValue);
  }

  return closestValues;
};

export default {
  calculateDistance,
  calculateLengths,
  calculatePathLength,
  getClosest,
  findMultipleClosest,
};
