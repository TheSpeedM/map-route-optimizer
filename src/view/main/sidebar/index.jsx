import { useState, useRef } from "react";
import { blocksize, mapSize, destinations, path, robotPosition, destinationPosition } from "../signals";

import { AlgorithmWithInputs, ButtonGroup } from "./buttongroup";

const INITIAL_VALUES = {
  width: 50,
  height: 50
};

const generateDestination = () => ({
  ...INITIAL_VALUES,
  x: Math.round(Math.random() * ((mapSize.value.width - 200) / blocksize)) * blocksize + 100,
  y: Math.round(Math.random() * ((mapSize.value.height - 200) / blocksize)) * blocksize + 100,
  index: destinations.value.length
})

const isDestinationUnique = (newDestination) => {
  return !destinations.value.some(dest => dest.x === newDestination.x && dest.y === newDestination.y);
};

const addDestination = () => {
  let newDestination = generateDestination();

  if (!isDestinationUnique(newDestination)) {
    newDestination = generateDestination();
  }

  destinations.value = [...destinations.value, newDestination];
  path.value = [];
};
const removeDestination = () => {
  if (destinations.value.length > 0) {
    destinations.value = destinations.value.slice(0, -1);
    destinationPosition.value = destinationPosition.value.slice(0, -1);
    path.value = [];
  }
};

const clearDestinations = () => {
  destinations.value = [];
  destinationPosition.value = [];
  path.value = [];
};

const workerScripts = {
  bruteforce: new URL('../../../calc/bruteforce', import.meta.url),
  closestneigbor: new URL('../../../calc/closestneigbor', import.meta.url),
  furthestneigbor: new URL('../../../calc/furthestneigbor', import.meta.url),
  fromstart: new URL('../../../calc/fromstart', import.meta.url),
  lookahead: new URL('../../../calc/lookahead', import.meta.url),
  randomguesses: new URL('../../../calc/randomguesses', import.meta.url)
};

export const Sidebar = () => {
  const [worker, setWorker] = useState(null);

  // Info
  const [isLoading, setIsLoading] = useState(false);
  const [length, setLength] = useState(-1);
  const [execTime, setExecTime] = useState(null);
  const [pathsSearched, setPathsSearched] = useState(null);

  // Optimistic bruteforce
  const bruteSpreadRef = useRef();

  // Custom algorithm
  const spreadRef = useRef();
  const lookaheadRef = useRef();

  const executeWorker = (workerType, params = {}) => {
    const startTime = Date.now();

    if (worker !== null) {
      worker.terminate();
    }

    const newWorker = new Worker(workerScripts[workerType], { type: 'module' });

    newWorker.postMessage({
      robotPosition: robotPosition.value,
      destinationPositions: destinationPosition.value,
      ...params
    });

    newWorker.onmessage = (e) => {
      const result = e.data;
      if (!result) return;

      setExecTime((Date.now() - startTime) / 1000);
      path.value = result.coords;

      setLength(result.length);
      setPathsSearched(result.paths);
      setWorker(null);
      setIsLoading(false);
    };

    newWorker.onerror = (e) => {
      console.error(e.message);
      setWorker(null);
      setIsLoading(false);
    }

    setWorker(newWorker);
    setIsLoading(true);
  };

  return (
    <div className="min-w-250">
      <div className="flex flex-col h-screen bg-gray-300 box-shadow-xl">
        <div className="bg-inherit divide-y divide-gray-400 border-b border-gray-400">
          <div className="py-3 px-3">
            <h1 className="text-xl font-bold ">Map Route Optimizer</h1>
            <a className="font-light underline decoration-blue-500" href="https://github.com/TheSpeedM/map-route-optimizer" target="_blank">TSP playground by Matth</a>
          </div>

          <div className="flex flex-col py-3 mx-3 text-sm font-mono leading-tight gap-1">
            <p>{isLoading ? 'Finding shortest path...' : 'Waiting on user input...'}</p>
            <p>Length: {length > 0 ? Math.round(length) : '...'} px</p>
            <p>Searched {pathsSearched !== null ? pathsSearched : '0'} paths {execTime !== null ? `in ${Math.round(execTime * 10) / 10} seconds` : ''}</p>
          </div>
        </div>

        <div className=" bg-inherit divide-y divide-gray-400 overflow-x-scroll">
          <ButtonGroup
            title={'Destinations'}
            buttons={[
              { title: 'Add destination', onClick: addDestination },
              { title: 'Remove destination', onClick: removeDestination },
              { title: 'Clear all destinations', onClick: clearDestinations }
            ]}
          />
          <ButtonGroup
            title={'Simple algorithms'}
            buttons={[
              { title: 'Bruteforce', onClick: () => executeWorker('bruteforce', worker, setWorker, setLength, setExecTime) },
              { title: 'Closest neighbor', onClick: () => executeWorker('closestneigbor', worker, setWorker, setLength, setExecTime) },
              { title: 'Furthest neighbor', onClick: () => executeWorker('furthestneigbor', worker, setWorker, setLength, setExecTime) },
              { title: 'Closest from start', onClick: () => executeWorker('fromstart', worker, setWorker, setLength, setExecTime) },
            ]}
          />

          <AlgorithmWithInputs
            title={'Optimistic bruteforce'}
            inputs={[{ title: 'Spread' }]}
            onClick={(params) => executeWorker('lookahead', { spread: params[0].value, lookahead: Infinity })}
            startCollapsed
          />

          <AlgorithmWithInputs
            title={'Limited lookahead'}
            inputs={[{ title: 'Spread' }, { title: 'Look ahead' }]}
            onClick={(params) => executeWorker('lookahead', { spread: params[0].value, lookahead: params[1].value })}
            startCollapsed
          />

          <AlgorithmWithInputs
            title={'Random guesses'}
            inputs={[{ title: 'Guesses', default: 100 }]}
            onClick={(params) => executeWorker('randomguesses', { guesses: params[0].value })}
            startCollapsed
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
