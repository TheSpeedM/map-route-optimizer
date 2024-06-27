import { calculateLengths, calculatePathLength, getClosest } from "./utils";

const LOOKAHEAD = 3;
const SPREAD = 3;

const findMultipleClosest = (startIndex, amount, lookupTable, excludeIndexes = []) => {
  const closestValues = [];
  while (closestValues.length < amount) {
    const closestValue = getClosest(startIndex, lookupTable, [...excludeIndexes, ...closestValues])

    if (closestValue === null) break;
    closestValues.push(closestValue);
  }

  return closestValues;
}

const expandPaths = (paths, spread, lookupTable) => {
  const newPaths = [];

  paths.forEach((path) => {
    const startIndex = path.at(-1);
    const excludeIndexes = path.slice(0, -1);
    const closestNext = findMultipleClosest(startIndex, spread, lookupTable, excludeIndexes);

    closestNext.forEach((index) => {
      newPaths.push([...path, index])
    })
  })

  return newPaths;
}

export const lookAheadSolve = (robotPosition, destinationPositions, lookahead = LOOKAHEAD, spread = SPREAD) => {
  if (destinationPositions.length === 0) return;

  const lookupTable = calculateLengths([{ ...robotPosition, index: -1 }, ...destinationPositions]);

  const indexOrder = [-1]

  while (indexOrder.length !== destinationPositions.length) {
    let paths = [indexOrder];

    for (let i = 0; i < lookahead; i++) {
      const expandedPaths = expandPaths(paths, spread, lookupTable);
      if (expandedPaths.length === 0) break;

      paths = expandedPaths;
    }

    console.log('paths 1', paths);

    const pathLengths = paths.map((path) => calculatePathLength(path, lookupTable));
    const minLength = Math.min(...pathLengths);
    const minPathIndex = pathLengths.findIndex((value) => value === minLength);
    const shortestPath = paths[minPathIndex];

    console.log('paths 2', paths);

    if (shortestPath.length === destinationPositions.length + 1) {
      if (indexOrder.length === 1) { // Meaning nothing has been pushed yet
        indexOrder.push(...shortestPath.slice(1));
        break;
      }

      indexOrder.push(...shortestPath.slice(-lookahead));
      break;
    }

    indexOrder.push(shortestPath[indexOrder.length]);
  }

  console.log('paths 3', indexOrder);

  const positions = indexOrder.slice(1).map((index) => destinationPositions.find((pos) => pos.index === index));
  return { coords: [robotPosition, ...positions], length: calculatePathLength(indexOrder, lookupTable) };
}

self.onmessage = (event) => {
  const { robotPosition, destinationPositions, lookahead, spread } = event.data;
  const result = lookAheadSolve(robotPosition, destinationPositions, lookahead, spread);
  postMessage(result);
}

export default { lookAheadSolve };
