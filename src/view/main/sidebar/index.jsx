import { useState, useRef } from "react";
import { destinations, path, robotPosition, destinationPosition } from "../signals";

const INITIAL_VALUES = {
  x: 100,
  y: 100,
  width: 50,
  height: 50
};

const addDestination = () => {
  destinations.value = [...destinations.value, { ...INITIAL_VALUES, index: destinations.value.length }];
};

const removeDestination = () => {
  if (destinations.value.length > 0) {
    destinations.value = destinations.value.slice(0, -1);
    destinationPosition.value = destinationPosition.value.slice(0, -1);
  }
};

const workerScripts = {
  bruteforce: new URL('../../../calc/bruteforce', import.meta.url),
  closestneigbor: new URL('../../../calc/closestneigbor', import.meta.url),
  lookahead: new URL('../../../calc/lookahead', import.meta.url)
};

const executeWorker = (workerType, worker, setWorker, setLength, setExecTime, params = {}) => {
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
  };

  newWorker.onerror = (e) => {
    console.error(e.message);
  }

  setWorker(newWorker);
};

export const Sidebar = () => {
  const [length, setLength] = useState(-1);
  const [execTime, setExecTime] = useState(null);
  const [worker, setWorker] = useState(null);

  const spreadRef = useRef();
  const lookaheadRef = useRef();

  return (
    <div className="flex flex-col h-screen bg-gray-300 divide-y divide-gray-400">
      <div className="flex flex-col py-3 mx-3 gap-1">
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
          Remove destination
        </button>
      </div>
      <div className="flex flex-col py-3 mx-3 gap-1">
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
          Look ahead solve
        </button>
      </div>

      <div className="flex flex-col py-3 mx-3">
        {length > 0 && <p>Length: {Math.round(length)} px</p>}
        {execTime !== null && <p>Time: {Math.round(execTime * 10) / 10} s</p>}
      </div>
    </div>
  );
};

export default Sidebar;
