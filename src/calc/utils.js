export const calculateDistance = (a, b) => {
  return Math.sqrt(
    Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)
  );
}

export const calculateLengths = (nodes) => {
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

export const calculatePathLength = (indexOrder, lookupTable) => {
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


export default { calculateDistance, calculateLengths, calculatePathLength };
