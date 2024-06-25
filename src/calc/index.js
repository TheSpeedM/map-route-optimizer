const calculateDistance = (a, b) => {
  return Math.sqrt(
    Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)
  );
}

const calculateLengths = (nodes) => {
  const results = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      results.push([
        nodes[i], nodes[j], calculateDistance(nodes[i], nodes[j])
      ]);
    }
  }

  return results;
}

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

const calculatePathLength = (indexOrder, lookupTable) => {
  let cumulativeLength = 0.0;

  for (let i = 1; i < indexOrder.length; i++) {
    const length = lookupTable.find((item) => (
      item[0].index === indexOrder[i] && item[1].index === indexOrder[i - 1] ||
      item[1].index === indexOrder[i] && item[0].index === indexOrder[i - 1])
    )[2]

    cumulativeLength += length;
  }

  return cumulativeLength;
}

export const findShortestOrder = (robotPosition, destinationPositions) => {
  const lookupTable = calculateLengths([{ ...robotPosition, index: -1 }, ...destinationPositions]);
  
  const indexes = destinationPositions.map((item) => item.index);
  const paths = getPermutations(indexes);

  const totalLengths = paths.map((path) => calculatePathLength([-1, ...path], lookupTable));
  const minLength = Math.min(...totalLengths)
  const shortestPath = paths[totalLengths.indexOf(minLength)]

  const positions = shortestPath.map((index) => destinationPositions.find((pos) => pos.index === index));

  return [robotPosition, ...positions];
}

export default findShortestOrder;
