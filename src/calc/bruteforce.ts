import {
  getMinimumValue,
  calculateLengths,
  calculatePathLength,
} from "./utils";

import {
  Position,
  DestinationPosition,
  AlgorithmWorkerMessage,
  AlgorithmReturnMessage,
} from "../utils/types";

const getPermutations = (array: number[]) => {
  const results: number[][] = [];

  function permute(arr: number[], m: number[] = []) {
    if (arr.length === 0) {
      results.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }

  permute(array);

  return results;
};

export const bruteforceSolve = (
  robotPosition: Position,
  destinationPositions: DestinationPosition[]
): AlgorithmReturnMessage => {
  if (destinationPositions.length === 0)
    throw new Error("No destinations given");

  const lookupTable = calculateLengths([
    { ...robotPosition, index: -1 },
    ...destinationPositions,
  ]);

  const indexes = destinationPositions.map((item) => item.index);
  const paths = getPermutations(indexes);

  const totalLengths = paths.map((path) =>
    calculatePathLength([-1, ...path], lookupTable)
  );
  const minLength = getMinimumValue(totalLengths);
  const shortestPath = paths[totalLengths.indexOf(minLength)];

  const positions: DestinationPosition[] = shortestPath.map((index) => {
    const destinationPos = destinationPositions.find(
      (pos) => pos.index === index
    );

    if (!destinationPos) throw new Error("No destination found");
    return destinationPos;
  });

  return {
    coords: [robotPosition, ...positions],
    length: minLength,
    paths: paths.length,
  };
};

self.onmessage = (event: AlgorithmWorkerMessage) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = bruteforceSolve(robotPosition, destinationPositions);
  postMessage(result);
};

export default { bruteforceSolve };
