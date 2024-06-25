import { useEffect, useState } from "react";

import { destinations, path, robotPosition, destinationPosition } from "../signals";

import { closestNeighbor } from "../../../calc/closestneigbor";

const INITIAL_VALUES = {
  x: 100,
  y: 100,
  width: 50,
  height: 50
};

export const Sidebar = () => {
  const [length, setLength] = useState(-1);
  const [execTime, setExecTime] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-300">
      <button
        className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2 m-3"
        onClick={() => destinations.value = [...destinations.value, { ...INITIAL_VALUES, index: destinations.value.length }]}
      >
        Add a destination
      </button>
      <button
        className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2 m-3"
        onClick={() => {
          const startTime = Date.now();
          const worker = new Worker(new URL('../../../calc/bruteforce', import.meta.url), { type: 'module' });

          worker.postMessage({
            robotPosition: robotPosition.value,
            destinationPositions: destinationPosition.value
          })

          worker.onmessage = (e) => {
            const result = e.data;
            if (!result) return;

            setExecTime((Date.now() - startTime) / 1000)
            path.value = result.coords;
            setLength(result.length);
          }
        }}
      >
        Bruteforce (very slow)
      </button>

      <button
        className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2 m-3"
        onClick={() => {
          const startTime = Date.now();
          const result = closestNeighbor(robotPosition.value, destinationPosition.value);

          if (!result) return;

          setExecTime((Date.now() - startTime) / 1000)
          path.value = result.coords;
          setLength(result.length);
        }}
      >
        Closest neighbor
      </button>

      {length > 0 && <p className="ml-3">Length: {Math.round(length)} px</p>}
      {execTime !== null && <p className="ml-3">Time: {Math.round(execTime * 10) / 10} s</p>}
    </div>
  )
}

export default Sidebar;
