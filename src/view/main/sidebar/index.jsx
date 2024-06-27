import { useState, useRef } from "react";
import { blocksize, mapSize, destinations, path, robotPosition, destinationPosition } from "../signals";

const INITIAL_VALUES = {
  width: 50,
  height: 50
};

const addDestination = () => {
  destinations.value = [...destinations.value, {
    ...INITIAL_VALUES,
    x: Math.round(Math.random() * ((mapSize.value.width - 200) / blocksize)) * blocksize + 100,
    y: Math.round(Math.random() * ((mapSize.value.height - 200) / blocksize)) * blocksize + 100,
    index: destinations.value.length
  }];
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
  lookahead: new URL('../../../calc/lookahead', import.meta.url)
};
export const Sidebar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [length, setLength] = useState(-1);
  const [execTime, setExecTime] = useState(null);
  const [worker, setWorker] = useState(null);
  
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
    <div className="flex flex-col h-screen bg-gray-300 divide-y divide-gray-400">
      <div className="py-3 mx-3">
        <h1 className="text-xl font-bold ">Map Route Optimizer</h1>
        <h2 className="font-light">TSP playground</h2>
      </div>

      <div className="flex flex-col py-3 mx-3 gap-1">
        <h3 className="font-semibold">Destinations</h3>
        <button
          className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
          onClick={addDestination}
        >
          Add a destination
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
          onClick={removeDestination}
        >
          Remove last destination
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
          onClick={clearDestinations}
        >
          Clear all destinations
        </button>
      </div>
      <div className="flex flex-col py-3 mx-3 gap-1">
        <h3 className="font-semibold">Simple algorithms</h3>
        <button
          className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
          onClick={() => executeWorker('bruteforce', worker, setWorker, setLength, setExecTime)}
        >
          Bruteforce (very slow)
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
          onClick={() => executeWorker('closestneigbor', worker, setWorker, setLength, setExecTime)}
        >
          Closest neighbor
        </button>
      </div>

      <div className="flex flex-col py-3 mx-3 gap-2">
        <h3 className="font-semibold">Custom algorithm</h3>
        <div className="flex text-sm gap-3">
          <p>Spread</p>
          <input
            ref={spreadRef}
            className="bg-gray-100 rounded-lg p-2 text-sm"
            type="number"
            defaultValue={3}
          />
        </div>

        <div className="flex text-sm gap-3">
          <p>Look ahead</p>
          <input
            ref={lookaheadRef}
            className="bg-gray-100 rounded-lg p-2"
            type="number"
            defaultValue={3}
          />
        </div>

        <button
          className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2"
          onClick={() => executeWorker(
            'lookahead',
            worker,
            setWorker,
            setLength,
            setExecTime,
            {
              lookahead: lookaheadRef.current.value,
              spread: spreadRef.current.value
            })}
        >
          Solve!
        </button>
      </div>

      <div className="flex flex-col py-3 mx-3">
        {isLoading && <p>Finding shortest path...</p>}
        {length > 0 && <p>Length: {Math.round(length)} px</p>}
        {execTime !== null && <p>Time: {Math.round(execTime * 10) / 10} s</p>}
      </div>
    </div>
  );
};

export default Sidebar;
