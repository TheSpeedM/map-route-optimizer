import { destinations, path, robotPosition, destinationPosition } from "../signals";

import findShortestOrder from "../../../calc";
import { useState } from "react";

const INITIAL_VALUES = {
  x: 100,
  y: 100,
  width: 50,
  height: 50
};

export const Sidebar = () => {
  const [length, setLength] = useState(-1);

  return (
    <div className="flex flex-col h-screen bg-gray-300">
      <button
        className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2 m-3"
        onClick={() => destinations.value = [...destinations.value, {...INITIAL_VALUES, index: destinations.value.length}]}
      >
        Add a destination
      </button>
      <button
      className="bg-gray-100 hover:bg-gray-200 transition rounded-lg p-2 m-3"
      onClick={() => {
        const result = findShortestOrder(robotPosition.value, destinationPosition.value);
        path.value = result.coords;
        setLength(result.length);
      }}
      >
        Solve TSP
      </button>

      {length > 0 && <p className="ml-3">Length: {Math.round(length)} px</p>}
    </div>
  )
}

export default Sidebar;
