importScripts(new URL('./bruteforce', import.meta.url));

onmessage = (e) => {
    const { robotPosition, destinationPositions } = e.data;
    const result = bruteforceSolve(robotPosition, destinationPositions);
    postMessage(result);
  }
  