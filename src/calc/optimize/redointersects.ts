import {
  AnyPosition,
  Coordinate,
  DestinationPosition,
  OptimizerReturnMessage,
  OptimizerWorkerMessage,
  Position,
  Vector,
} from "../../utils/types";

import { calculateLengths, calculatePathLength } from "../utils";

const MAX_TRIES = 1000;

// Intersection source code: https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p: Coordinate, q: Coordinate, r: Coordinate) {
  if (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  )
    return true;

  return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p: Coordinate, q: Coordinate, r: Coordinate) {
  // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
  // for details of below formula.
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val == 0) return 0; // collinear

  return val > 0 ? 1 : 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(
  p1: Coordinate,
  q1: Coordinate,
  p2: Coordinate,
  q2: Coordinate
) {
  // Find the four orientations needed for general and
  // special cases
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4) return true;

  // Special Cases
  // p1, q1 and p2 are collinear and p2 lies on segment p1q1
  if (o1 == 0 && onSegment(p1, p2, q1)) return true;

  // p1, q1 and q2 are collinear and q2 lies on segment p1q1
  if (o2 == 0 && onSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are collinear and p1 lies on segment p2q2
  if (o3 == 0 && onSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are collinear and q1 lies on segment p2q2
  if (o4 == 0 && onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
}

export const redoIntersectsOptimize = (
  coords: AnyPosition[]
): OptimizerReturnMessage => {
  let finalCoords = [...coords];
  let pathsExplored: number;

  for (pathsExplored = 0; pathsExplored < MAX_TRIES; pathsExplored++) {
    const swappedCoords = [...finalCoords];

    outerLoop: for (let i = 1; i < finalCoords.length; i++) {
      for (let j = 1; j < finalCoords.length; j++) {
        if (i - 1 === j || i === j || i === j - 1) continue;

        if (
          doIntersect(
            finalCoords[i - 1],
            finalCoords[i],
            finalCoords[j - 1],
            finalCoords[j]
          )
        ) {
          [swappedCoords[i], swappedCoords[j - 1]] = [
            swappedCoords[j - 1],
            swappedCoords[i],
          ];

          break outerLoop;
        }
      }
    }

    const areEqual = finalCoords.every(
      (item, index) => item === swappedCoords[index]
    );

    finalCoords = swappedCoords;
    if (areEqual) break;
  }

  const justIndexes = finalCoords.map((item) => item?.index ?? -1);
  const coordsWithIndex = coords.map((item) =>
    item?.index !== undefined
      ? (item as DestinationPosition)
      : ({ ...item, index: -1 } as DestinationPosition)
  );

  const lookupTable = calculateLengths(coordsWithIndex);

  return {
    coords: finalCoords,
    length: calculatePathLength(justIndexes, lookupTable),
    paths: pathsExplored,
  };
};

self.onmessage = (event: OptimizerWorkerMessage) => {
  const { coords } = event.data;
  const result = redoIntersectsOptimize(coords);
  postMessage(result);
};

export default { redoIntersectsOptimize };
