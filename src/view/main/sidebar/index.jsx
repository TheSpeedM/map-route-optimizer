import { destinations, robotPosition, destinationPosition } from "../signals";

import findShortestOrder from "../../../calc";

const INITIAL_VALUES = {
  x: 100,
  y: 100,
  width: 50,
  height: 50
};

export const Sidebar = () => {
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
      onClick={() => findShortestOrder(robotPosition.value, destinationPosition.value)}
      >
        Solve TSP
      </button>
    </div>
  )
}

export default Sidebar;
