import { calculateLengths, calculatePathLength } from "./utils";

const GUESSES = 100;

// From https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;

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

export const randomGuessesSolve = (robotPosition, destinationPositions, guesses = GUESSES) => {
  if (destinationPositions.length === 0) return;

  const lookupTable = calculateLengths([{ ...robotPosition, index: -1 }, ...destinationPositions]);
  const startOrder = destinationPositions.map((pos) => pos.index);

  let indexOrder = [...startOrder];
  let shortestLength = Infinity;

  for (let i = 0; i < guesses; i++) {
    const shuffledArray = shuffle([...startOrder]);
    const shuffledLength = calculatePathLength([-1, ...shuffledArray], lookupTable);

    if (shuffledLength < shortestLength) {
      indexOrder = [...shuffledArray];
      shortestLength = shuffledLength;
    }
  }

  const positions = indexOrder.map((index) => destinationPositions.find((pos) => pos.index === index));

  return {
    coords: [robotPosition, ...positions],
    length: shortestLength,
    paths: guesses
  };
}


self.onmessage = (event) => {
  const { robotPosition, destinationPositions, guesses } = event.data;
  const result = randomGuessesSolve(robotPosition, destinationPositions, guesses);
  postMessage(result);
}

export default { randomGuessesSolve };
