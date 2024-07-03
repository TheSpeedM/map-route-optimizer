import { useState, useRef } from "react";

import {
  blocksize,
  mapSize,
  destinations,
  path,
  robotPosition,
  destinationPosition,
  algorithmStats,
  resetSignals,
} from "../signals";

import { AlgorithmWithInputs, ButtonGroup } from "./buttongroup";

const INITIAL_VALUES = {
  width: 50,
  height: 50,
};

const generateDestination = () => ({
  ...INITIAL_VALUES,
  x:
    Math.round(Math.random() * ((mapSize.value.width - 200) / blocksize)) *
      blocksize +
    100,
  y:
    Math.round(Math.random() * ((mapSize.value.height - 200) / blocksize)) *
      blocksize +
    100,
  index: destinations.value.length,
});

const isDestinationUnique = (newDestination) => {
  return !destinations.value.some(
    (dest) => dest.x === newDestination.x && dest.y === newDestination.y
  );
};

const addDestination = () => {
  let newDestination = generateDestination();

  if (!isDestinationUnique(newDestination)) {
    newDestination = generateDestination();
  }

  destinations.value = [...destinations.value, newDestination];
  resetSignals();
};
const removeDestination = () => {
  if (destinations.value.length > 0) {
    destinations.value = destinations.value.slice(0, -1);
    destinationPosition.value = destinationPosition.value.slice(0, -1);
    resetSignals();
  }
};

const clearDestinations = () => {
  destinations.value = [];
  destinationPosition.value = [];
  resetSignals();
};

const baseSolveUrl = "../../../calc/solve/";
const baseOptimizeUrl = "../../../calc/optimize/";

const getScriptUrl = (baseUrl, name) => {
  return new URL(`${baseUrl}${name}`, import.meta.url);
};

export const Sidebar = () => {
  const [worker, setWorker] = useState(null);

  // Info
  const [isLoading, setIsLoading] = useState(false);
  const [length, setLength] = useState(-1);
  const [execTime, setExecTime] = useState(null);
  const [pathsSearched, setPathsSearched] = useState(null);

  const executeWorker = (baseUrl, workerType, message, onMessage) => {
    const startTime = Date.now();

    if (worker !== null) {
      worker.terminate();
    }

    const newWorker = new Worker(getScriptUrl(baseUrl, workerType), {
      type: "module",
    });

    newWorker.postMessage(message);

    newWorker.onmessage = (e) => {
      const result = e.data;
      if (!result) return;

      onMessage(result, startTime);

      setWorker(null);
      setIsLoading(false);
    };

    newWorker.onerror = (e) => {
      console.error(e.message);
      setWorker(null);
      setIsLoading(false);
    };

    setWorker(newWorker);
    setIsLoading(true);
  };

  const executeSolver = (workerType, params = {}) => {
    executeWorker(
      baseSolveUrl,
      workerType,
      {
        robotPosition: robotPosition.value,
        destinationPositions: destinationPosition.value,
        ...params,
      },
      (result, startTime) => {
        path.value = result.coords;

        const statsObject = {
          time: (Date.now() - startTime) / 1000,
          length: Number(result.length),
          paths: Number(result.paths),
        };

        const keyAlreadyExists = algorithmStats.value.some((item) =>
          item[0].includes(workerType)
        );

        if (!keyAlreadyExists) {
          algorithmStats.value = [
            ...algorithmStats.value,
            [workerType, statsObject],
          ].slice(-5);
        }

        setExecTime(statsObject.time);
        setLength(statsObject.length);
        setPathsSearched(statsObject.paths);
      }
    );
  };

  const executeOptimizer = (workerType, params = {}) => {
    executeWorker(
      baseOptimizeUrl,
      workerType,
      {
        coords: path.value,
        ...params,
      },
      (result, startTime) => {
        path.value = result.coords;

        const [lastKey, lastStats] = algorithmStats.value.at(-1);

        const statsObject = {
          time: lastStats.time + (Date.now() - startTime) / 1000,
          length: Number(result.length),
          paths: Number(lastStats.paths) + Number(result.paths),
        };

        const keyAlreadyExists = algorithmStats.value.some(
          (item) => item[0].includes(workerType) && item[0].includes(lastKey)
        );

        if (!keyAlreadyExists) {
          algorithmStats.value = [
            ...algorithmStats.value,
            [`${lastKey} + ${workerType}`, statsObject],
          ].slice(-5);
        }

        setExecTime(statsObject.time);
        setLength(statsObject.length);
        setPathsSearched(statsObject.paths);
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-300 box-shadow-xl w-64">
      <div className="bg-inherit divide-y divide-gray-400 border-b border-gray-400">
        <div className="py-3 px-3">
          <h1 className="text-xl font-bold ">Map Route Optimizer</h1>
          <a
            className="font-light underline decoration-blue-500"
            href="https://github.com/TheSpeedM/map-route-optimizer"
            target="_blank"
          >
            TSP playground by Matth
          </a>
        </div>

        <div className="flex flex-col py-3 mx-3 text-sm font-mono leading-tight gap-1">
          <p>
            {isLoading
              ? "Finding shortest path..."
              : "Waiting on user input..."}
          </p>
          <p>Length: {length > 0 ? Math.round(length) : "..."} px</p>
          <p>
            Searched {pathsSearched !== null ? pathsSearched : "0"} paths{" "}
            {execTime !== null
              ? `in ${Math.round(execTime * 10) / 10} seconds`
              : ""}
          </p>
        </div>
      </div>

      <div className=" bg-inherit divide-y divide-gray-400 overflow-x-scroll">
        <ButtonGroup
          title={"Destinations"}
          buttons={[
            { title: "Add destination", onClick: addDestination },
            { title: "Remove destination", onClick: removeDestination },
            { title: "Clear all destinations", onClick: clearDestinations },
          ]}
        />
        <ButtonGroup
          title={"Simple algorithms"}
          buttons={[
            {
              title: "Bruteforce",
              onClick: () => executeSolver("bruteforce"),
            },
            {
              title: "Closest neighbor",
              onClick: () => executeSolver("closestneigbor"),
            },
            {
              title: "Furthest neighbor",
              onClick: () => executeSolver("furthestneigbor"),
            },
            {
              title: "Closest from start",
              onClick: () => executeSolver("fromstart"),
            },
          ]}
        />

        <AlgorithmWithInputs
          title={"Optimistic bruteforce"}
          inputs={[{ title: "Spread" }]}
          onClick={(params) =>
            executeSolver("lookahead", {
              spread: params[0].value,
              lookahead: Infinity,
            })
          }
          startCollapsed
        />

        <AlgorithmWithInputs
          title={"Random guesses"}
          inputs={[{ title: "Guesses", default: 100 }]}
          onClick={(params) =>
            executeSolver("randomguesses", { guesses: params[0].value })
          }
          startCollapsed
        />

        <AlgorithmWithInputs
          title={"Limited lookahead"}
          inputs={[{ title: "Spread" }, { title: "Look ahead" }]}
          onClick={(params) =>
            executeSolver("lookahead", {
              spread: params[0].value,
              lookahead: params[1].value,
            })
          }
          startCollapsed
        />

        <AlgorithmWithInputs
          title={"Estimate length"}
          inputs={[{ title: "Spread" }, { title: "Look ahead" }]}
          onClick={(params) =>
            executeSolver("estimatelength", {
              spread: params[0].value,
              lookahead: params[1].value,
            })
          }
          startCollapsed
        />

        <ButtonGroup
          title={"Optimizers"}
          buttons={[
            {
              title: "Redo intersects",
              onClick: () => executeOptimizer("redointersects"),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Sidebar;
