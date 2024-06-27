import { calculateLengths, calculatePathLength } from "./utils";

const getPermutations = (array) => {
  const results = [];

  function permute(arr, m = []) {
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
}

export const bruteforceSolve = (robotPosition, destinationPositions) => {
  const lookupTable = calculateLengths([{ ...robotPosition, index: -1 }, ...destinationPositions]);

  const indexes = destinationPositions.map((item) => item.index);
  const paths = getPermutations(indexes);

  const totalLengths = paths.map((path) => calculatePathLength([-1, ...path], lookupTable));
  const minLength = Math.min(...totalLengths)
  const shortestPath = paths[totalLengths.indexOf(minLength)]

  const positions = shortestPath.map((index) => destinationPositions.find((pos) => pos.index === index));

  return { coords: [robotPosition, ...positions], length: minLength };
}

self.onmessage = (event) => {
  const { robotPosition, destinationPositions } = event.data;
  const result = bruteforceSolve(robotPosition, destinationPositions);
  postMessage(result);
}

export default { bruteforceSolve };
