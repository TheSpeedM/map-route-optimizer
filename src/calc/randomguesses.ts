import { calculateLengths, calculatePathLength } from "./utils";

import {
  Position,
  DestinationPosition,
  RandomGuessesWorkerMessage,
  AlgorithmReturnMessage,
} from "../utils/types";

const GUESSES = 100;

// From https://bost.ocks.org/mike/shuffle/
function shuffle(array: number[]) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export const randomGuessesSolve = (
  robotPosition: Position,
  destinationPositions: DestinationPosition[],
  guesses = GUESSES
): AlgorithmReturnMessage => {
  if (destinationPositions.length === 0)
    throw new Error("No destinations given");

  const lookupTable = calculateLengths([
    { ...robotPosition, index: -1 },
    ...destinationPositions,
  ]);

  const startOrder = destinationPositions.map((pos) => pos.index);

  let indexOrder = [...startOrder];
  let shortestLength = Infinity;

  for (let i = 0; i < guesses; i++) {
    const shuffledArray = shuffle([...startOrder]);
    const shuffledLength = calculatePathLength(
      [-1, ...shuffledArray],
      lookupTable
    );

    if (shuffledLength < shortestLength) {
      indexOrder = [...shuffledArray];
      shortestLength = shuffledLength;
    }
  }

  const positions = indexOrder.map((index) => {
    const destinationPos = destinationPositions.find(
      (pos) => pos.index === index
    );

    if (!destinationPos) throw new Error("No destination found");
    return destinationPos;
  });

  return {
    coords: [robotPosition, ...positions],
    length: shortestLength,
    paths: guesses,
  };
};

self.onmessage = (event: RandomGuessesWorkerMessage) => {
  const { robotPosition, destinationPositions, guesses } = event.data;
  const result = randomGuessesSolve(
    robotPosition,
    destinationPositions,
    guesses
  );
  postMessage(result);
};

export default { randomGuessesSolve };
